package de.starwit.service.impl;

import java.io.IOException;
import java.net.URI;
import java.security.InvalidKeyException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.persistence.exception.NotificationException;

/**
 * Exports accepted decisions to CVAT by creating a task, uploading their original
 * images and matching detector boxes, then marking their actions complete.
 */
@Service
public class CvatExportService {

    static final Logger LOG = LoggerFactory.getLogger(CvatExportService.class);

    /** Sentinel value for {@link ActionTypeEntity#getEndpoint()}: a manual action type whose endpoint
     * equals this string is exported to CVAT instead of being sent to a remote URI. */
    private static final String CVAT_ENDPOINT = "cvat";
    private static final String DETECTIONS_FILE_NAME = "detections.json";
    private static final String ORIGINAL_FILE_NAME = "original.jpg";
    private static final DateTimeFormatter TASK_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd/HHmmss");
    // CVAT defaults to 70; use 90 so small detections remain clear after image compression.
    private static final int CVAT_IMAGE_QUALITY = 90;
    private static final int CVAT_REQUEST_POLL_INTERVAL_MS = 1000;
    private static final int CVAT_PROCESSING_TIMEOUT_SECONDS = 300;
    // Match cvat_sdk.core.uploading.MAX_REQUEST_SIZE for Upload-Multiple requests.
    private static final int CVAT_MAX_UPLOAD_REQUEST_SIZE_BYTES = 100 * 1024 * 1024;

    @Value("${cvat.base-url:}")
    private String cvatBaseUrl;

    @Value("${cvat.token:}")
    private String cvatToken;

    @Value("${cvat.project-id:0}")
    private long cvatProjectId;

    @Value("${cvat.organization-slug:}")
    private String cvatOrganizationSlug;

    @Autowired
    private ActionService actionService;

    @Autowired
    private MinioService minioService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void exportModule(Long moduleId) throws InvalidKeyException, IOException, NotificationException {
        if (cvatBaseUrl.isBlank() || cvatToken.isBlank() || cvatProjectId <= 0
                || cvatOrganizationSlug.isBlank()) {
            throw new NotificationException("error.cvat.unconfigured", "CVAT is not configured.");
        }
        List<ActionEntity> actions = findCvatActions(moduleId);
        if (actions.isEmpty()) {
            throw new NotificationException("error.cvat.empty", "No CVAT actions to export.");
        }

        List<CvatImage> images = prepareImages(actions);
        Map<String, Integer> labelIds = getLabelIds();
        Long taskId = createTask();
        LOG.info("Created CVAT task {} for module {} with {} images.", taskId, moduleId, images.size());
        try {
            waitForRequest(uploadImages(taskId, images));
            uploadAnnotations(taskId, images, labelIds);
            actionService.markCvatExported(actions, taskId);
        } catch (InvalidKeyException | IOException | RuntimeException e) {
            deleteTask(taskId);
            throw e;
        }
        LOG.info("Exported {} CVAT actions for module {} to task {}.", actions.size(), moduleId, taskId);
    }

    private void deleteTask(Long taskId) {
        try {
            restTemplate.exchange(RequestEntity
                    .delete(apiUri("/tasks/" + taskId))
                    .headers(headers(MediaType.APPLICATION_JSON))
                    .build(), Void.class);
        } catch (RuntimeException e) {
            LOG.warn("Could not delete incomplete CVAT task {}.", taskId, e);
        }
    }

    private List<ActionEntity> findCvatActions(Long moduleId) {
        return actionService.findAllNewActions().stream()
                .filter(action -> isCvatAction(action, moduleId))
                .sorted(Comparator.comparing(ActionEntity::getId))
                .toList();
    }

    /** An action is a CVAT export candidate when its decision is accepted and belongs to the given
     * module, and its action type is manual with the {@link #CVAT_ENDPOINT} sentinel as endpoint. */
    private boolean isCvatAction(ActionEntity action, Long moduleId) {
        DecisionEntity decision = action.getDecision();
        ActionTypeEntity actionType = action.getActionType();

        return decision != null
                && actionType != null
                && decision.getModule() != null
                && moduleId.equals(decision.getModule().getId())
                && decision.getState() == DecisionState.ACCEPTED
                && actionType.getExecutionPolicy() == ExecutionPolicy.MANUAL
                && CVAT_ENDPOINT.equals(actionType.getEndpoint());
    }

    private Long createTask() {
        JsonNode response = restTemplate.exchange(RequestEntity
                .post(apiUri("/tasks"))
                .headers(headers(MediaType.APPLICATION_JSON))
                .body(Map.of(
                        "name", "ai-cockpit-output/" + OffsetDateTime.now().format(TASK_DATE_FORMAT),
                        "project_id", cvatProjectId)), JsonNode.class).getBody();
        return response.get("id").asLong();
    }

    private List<CvatImage> prepareImages(List<ActionEntity> actions) throws InvalidKeyException, IOException {
        List<CvatImage> images = new ArrayList<>();
        for (int i = 0; i < actions.size(); i++) {
            ActionEntity action = actions.get(i);
            DecisionEntity decision = action.getDecision();
            String mediaUrl = decision.getMediaUrl();
            int mediaSeparator = mediaUrl.indexOf("/");
            String bucketName = mediaUrl.substring(0, mediaSeparator);
            String mediaObjectName = mediaUrl.substring(mediaSeparator + 1);

            int pathSeparator = mediaObjectName.lastIndexOf("/");
            // The connector stores all files for one decision in the same MinIO directory.
            String objectPrefix = mediaObjectName.substring(0, pathSeparator + 1);
            String detectionsObjectName = objectPrefix + DETECTIONS_FILE_NAME;
            JsonNode detections = objectMapper.readTree(
                    minioService.getFileFromMinio(bucketName, detectionsObjectName));
            String objectName = objectPrefix + ORIGINAL_FILE_NAME;
            String cvatFileName = String.format(
                    "%06d-decision-%d-%s", i, decision.getId(), ORIGINAL_FILE_NAME);

            images.add(new CvatImage(bucketName, objectName, cvatFileName, detections));
        }
        return images;
    }

    private String uploadImages(Long taskId, List<CvatImage> images) throws InvalidKeyException, IOException {
        // CVAT requires a start/multiple/finish sequence and processes the finished upload asynchronously.
        sendDataRequest(taskId, "Upload-Start", null);
        MultiValueMap<String, Object> body = newDataBody();
        int batchSize = 0;
        int batchFileIndex = 0;

        for (CvatImage image : images) {
            byte[] data = minioService.getFileFromMinio(image.bucketName(), image.objectName());
            if (batchFileIndex > 0 && batchSize + data.length > CVAT_MAX_UPLOAD_REQUEST_SIZE_BYTES) {
                sendDataRequest(taskId, "Upload-Multiple", body);
                body = newDataBody();
                batchSize = 0;
                batchFileIndex = 0;
            }
            body.add("client_files[" + batchFileIndex + "]", new CvatFile(data, image.fileName()));
            batchSize += data.length;
            batchFileIndex++;
        }
        sendDataRequest(taskId, "Upload-Multiple", body);

        MultiValueMap<String, Object> finishBody = newDataBody();
        finishBody.add("sorting_method", "lexicographical");
        return sendDataRequest(taskId, "Upload-Finish", finishBody).get("rq_id").asText();
    }

    private MultiValueMap<String, Object> newDataBody() {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image_quality", String.valueOf(CVAT_IMAGE_QUALITY));
        return body;
    }

    private JsonNode sendDataRequest(Long taskId, String uploadHeader, MultiValueMap<String, Object> body) {
        HttpHeaders requestHeaders = headers(body == null ? MediaType.APPLICATION_JSON : MediaType.MULTIPART_FORM_DATA);
        requestHeaders.set(uploadHeader, "true");
        return restTemplate.exchange(RequestEntity
                .post(apiUri("/tasks/" + taskId + "/data/"))
                .headers(requestHeaders)
                .body(body), JsonNode.class).getBody();
    }

    private void waitForRequest(String requestId) {
        Instant deadline = Instant.now().plusSeconds(CVAT_PROCESSING_TIMEOUT_SECONDS);
        while (Instant.now().isBefore(deadline)) {
            JsonNode response = restTemplate.exchange(RequestEntity
                    .get(apiUri("/requests/" + requestId))
                    .headers(headers(MediaType.APPLICATION_JSON))
                    .build(), JsonNode.class).getBody();
            String status = response.get("status").asText();
            if ("finished".equals(status)) {
                return;
            }
            if ("failed".equals(status)) {
                throw new IllegalStateException("CVAT data upload failed.");
            }
            try {
                Thread.sleep(CVAT_REQUEST_POLL_INTERVAL_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("CVAT data upload interrupted.", e);
            }
        }
        throw new IllegalStateException(
                "CVAT data upload did not finish within " + CVAT_PROCESSING_TIMEOUT_SECONDS + " seconds.");
    }

    private void uploadAnnotations(Long taskId, List<CvatImage> images, Map<String, Integer> labelIds) {
        List<Map<String, Object>> shapes = buildShapes(taskId, images, labelIds);
        restTemplate.exchange(RequestEntity
                .put(apiUri("/tasks/" + taskId + "/annotations/"))
                .headers(headers(MediaType.APPLICATION_JSON))
                .body(Map.of("shapes", shapes)), Void.class);
    }

    private List<Map<String, Object>> buildShapes(Long taskId, List<CvatImage> images,
            Map<String, Integer> labelIds) {
        JsonNode frames = restTemplate.exchange(RequestEntity
                .get(apiUri("/tasks/" + taskId + "/data/meta"))
                .headers(headers(MediaType.APPLICATION_JSON))
                .build(), JsonNode.class).getBody().get("frames");
        List<Map<String, Object>> shapes = new ArrayList<>();
        Set<String> missingLabels = new LinkedHashSet<>();

        for (int frame = 0; frame < images.size(); frame++) {
            JsonNode detections = images.get(frame).detections();
            JsonNode frameSize = frames.get(frame);
            double frameWidth = frameSize.get("width").asDouble();
            double frameHeight = frameSize.get("height").asDouble();

            for (JsonNode detection : detections) {
                String label = detection.get("label").asText();
                Integer labelId = labelIds.get(label);
                if (labelId == null) {
                    missingLabels.add(label);
                    continue;
                }
                JsonNode boundingBox = detection.get("boundingBox");

                double minX = boundingBox.get("minX").asDouble() * frameWidth;
                double minY = boundingBox.get("minY").asDouble() * frameHeight;
                double maxX = boundingBox.get("maxX").asDouble() * frameWidth;
                double maxY = boundingBox.get("maxY").asDouble() * frameHeight;

                shapes.add(Map.of(
                        "type", "rectangle",
                        "frame", frame,
                        "label_id", labelId,
                        "points", List.of(minX, minY, maxX, maxY),
                        "source", "auto"));
            }
        }
        if (!missingLabels.isEmpty()) {
            LOG.warn("Dropped pre-annotations with labels missing in the CVAT project: {}.",
                    String.join(", ", missingLabels));
        }
        return shapes;
    }

    private Map<String, Integer> getLabelIds() {
        // page_size=100 is sufficient for this project; CVAT only allows page_size=all
        // on development deployments.
        JsonNode response = restTemplate.exchange(RequestEntity
                .get(apiUri("/labels?project_id=" + cvatProjectId + "&page_size=100"))
                .headers(headers(MediaType.APPLICATION_JSON))
                .build(), JsonNode.class).getBody();

        Map<String, Integer> labelIds = new HashMap<>();
        for (JsonNode label : response.get("results")) {
            labelIds.put(label.get("name").asText(), label.get("id").asInt());
        }
        return labelIds;
    }

    private HttpHeaders headers(MediaType contentType) {
        // The deployed CVAT API exposes tokenAuth with the "Token" prefix.
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.valueOf("application/vnd.cvat+json")));
        headers.setContentType(contentType);
        headers.set(HttpHeaders.AUTHORIZATION, "Token " + cvatToken);
        headers.set("X-Organization", cvatOrganizationSlug);
        return headers;
    }

    private URI apiUri(String path) {
        String baseUrl = cvatBaseUrl.endsWith("/") ? cvatBaseUrl.substring(0, cvatBaseUrl.length() - 1) : cvatBaseUrl;
        return URI.create(baseUrl + "/api" + path);
    }

    private static class CvatFile extends ByteArrayResource {

        private final String fileName;

        CvatFile(byte[] byteArray, String fileName) {
            super(byteArray);
            this.fileName = fileName;
        }

        @Override
        public String getFilename() {
            return fileName;
        }
    }

    private record CvatImage(String bucketName, String objectName, String fileName, JsonNode detections) {
    }
}
