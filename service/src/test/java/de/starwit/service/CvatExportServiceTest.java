package de.starwit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.service.impl.CvatExportService;
import de.starwit.service.impl.ActionService;
import de.starwit.service.impl.MinioService;

@ExtendWith(MockitoExtension.class)
public class CvatExportServiceTest {

    @Mock
    private ActionService actionService;

    @Mock
    private MinioService minioService;

    @Mock
    private RestTemplate restTemplate;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private CvatExportService cvatExportService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cvatExportService, "cvatBaseUrl", "");
        ReflectionTestUtils.setField(cvatExportService, "cvatToken", "");
        ReflectionTestUtils.setField(cvatExportService, "cvatProjectId", 0L);
        ReflectionTestUtils.setField(cvatExportService, "cvatOrganizationSlug", "");
    }

    private void configureCvat() {
        ReflectionTestUtils.setField(cvatExportService, "cvatBaseUrl", "http://cvat:8080");
        ReflectionTestUtils.setField(cvatExportService, "cvatToken", "token");
        ReflectionTestUtils.setField(cvatExportService, "cvatProjectId", 1L);
        ReflectionTestUtils.setField(cvatExportService, "cvatOrganizationSlug", "Starwit");
    }

    @Test
    void exportFailsWhenCvatIsNotConfigured() {
        NotificationException e = assertThrows(NotificationException.class,
                () -> cvatExportService.exportModule(1L));
        assertEquals("error.cvat.unconfigured", e.getExceptionKey());
    }

    @Test
    void exportFailsWhenOnlyRejectedCvatActionsExist() {
        configureCvat();
        ActionEntity action = cvatAction();
        action.getDecision().setState(DecisionState.REJECTED);
        when(actionService.findAllNewActions()).thenReturn(List.of(action));

        NotificationException e = assertThrows(NotificationException.class,
                () -> cvatExportService.exportModule(1L));
        assertEquals("error.cvat.empty", e.getExceptionKey());
    }

    @Test
    void exportsEligibleActionAndDropsUnknownLabel() throws Exception {
        configureCvat();
        ActionEntity action = cvatAction();
        ActionEntity otherModuleAction = cvatAction(2L, 2L, 8L, "other-module");
        ActionEntity nonCvatAction = cvatAction(3L, 1L, 9L, "non-cvat");
        nonCvatAction.getActionType().setEndpoint("https://example.com/action");
        when(actionService.findAllNewActions()).thenReturn(List.of(otherModuleAction, action, nonCvatAction));
        when(minioService.getFileFromMinio("bucket", "20260713_132117_08ad71/detections.json"))
                .thenReturn(("[{\"label\":\"cat\",\"boundingBox\":{\"minX\":0.1,\"minY\":0.2,\"maxX\":0.3,\"maxY\":0.4}},"
                        + "{\"label\":\"dog\",\"boundingBox\":{\"minX\":0.1,\"minY\":0.2,\"maxX\":0.3,\"maxY\":0.4}}]")
                        .getBytes(StandardCharsets.UTF_8));
        when(minioService.getFileFromMinio("bucket", "20260713_132117_08ad71/original.jpg"))
                .thenReturn(new byte[] { 1, 2, 3 });

        JsonNode labels = objectMapper.readTree("{\"results\":[{\"id\":11,\"name\":\"cat\"}]}");
        JsonNode task = objectMapper.readTree("{\"id\":42}");
        JsonNode emptyResponse = objectMapper.readTree("{}");
        JsonNode request = objectMapper.readTree("{\"rq_id\":\"request-1\"}");
        JsonNode requestStatus = objectMapper.readTree("{\"status\":\"finished\"}");
        JsonNode frames = objectMapper.readTree("{\"frames\":[{\"width\":1280,\"height\":720}]}");
        when(restTemplate.exchange(any(RequestEntity.class), eq(JsonNode.class)))
                .thenReturn(ResponseEntity.ok(labels))
                .thenReturn(ResponseEntity.ok(task))
                .thenReturn(ResponseEntity.ok(emptyResponse))
                .thenReturn(ResponseEntity.ok(emptyResponse))
                .thenReturn(ResponseEntity.ok(request))
                .thenReturn(ResponseEntity.ok(requestStatus))
                .thenReturn(ResponseEntity.ok(frames));
        when(restTemplate.exchange(any(RequestEntity.class), eq(Void.class)))
                .thenReturn(ResponseEntity.ok().build());

        cvatExportService.exportModule(1L);

        verify(minioService, never()).getFileFromMinio("bucket", "other-module/detections.json");
        verify(minioService, never()).getFileFromMinio("bucket", "non-cvat/detections.json");
        verify(actionService).markCvatExported(List.of(action), 42L);
        ArgumentCaptor<RequestEntity> annotationRequest = ArgumentCaptor.forClass(RequestEntity.class);
        verify(restTemplate).exchange(annotationRequest.capture(), eq(Void.class));
        JsonNode annotation = objectMapper.valueToTree(annotationRequest.getValue().getBody());
        assertEquals("Starwit", annotationRequest.getValue().getHeaders().getFirst("X-Organization"));
        assertEquals(1, annotation.get("shapes").size());
        JsonNode shape = annotation.get("shapes").get(0);
        assertEquals(0, shape.get("frame").asInt());
        assertEquals(11, shape.get("label_id").asInt());
        assertEquals(objectMapper.readTree("[128.0,144.0,384.0,288.0]"), shape.get("points"));
    }

    @Test
    void deletesTaskWhenUploadFailsAfterCreation() throws Exception {
        configureCvat();
        ActionEntity action = cvatAction();
        when(actionService.findAllNewActions()).thenReturn(List.of(action));
        when(minioService.getFileFromMinio("bucket", "20260713_132117_08ad71/detections.json"))
                .thenReturn("[]".getBytes(StandardCharsets.UTF_8));

        JsonNode labels = objectMapper.readTree("{\"results\":[]}");
        JsonNode task = objectMapper.readTree("{\"id\":42}");
        when(restTemplate.exchange(any(RequestEntity.class), eq(JsonNode.class)))
                .thenReturn(ResponseEntity.ok(labels))
                .thenReturn(ResponseEntity.ok(task))
                .thenThrow(new RestClientException("upload failed"));
        when(restTemplate.exchange(any(RequestEntity.class), eq(Void.class)))
                .thenReturn(ResponseEntity.ok().build());

        assertThrows(RestClientException.class, () -> cvatExportService.exportModule(1L));

        ArgumentCaptor<RequestEntity> deleteRequest = ArgumentCaptor.forClass(RequestEntity.class);
        verify(restTemplate).exchange(deleteRequest.capture(), eq(Void.class));
        assertEquals(HttpMethod.DELETE, deleteRequest.getValue().getMethod());
        assertEquals("http://cvat:8080/api/tasks/42", deleteRequest.getValue().getUrl().toString());
        verify(actionService, never()).markCvatExported(any(), any());
    }

    private ActionEntity cvatAction() {
        return cvatAction(1L, 1L, 7L, "20260713_132117_08ad71");
    }

    private ActionEntity cvatAction(Long actionId, Long moduleId, Long decisionId, String objectPrefix) {
        ModuleEntity module = new ModuleEntity();
        module.setId(moduleId);

        DecisionEntity decision = new DecisionEntity();
        decision.setId(decisionId);
        decision.setState(DecisionState.ACCEPTED);
        decision.setModule(module);
        decision.setMediaUrl("bucket/" + objectPrefix + "/annotated.jpg");

        ActionTypeEntity actionType = new ActionTypeEntity();
        actionType.setExecutionPolicy(ExecutionPolicy.MANUAL);
        actionType.setEndpoint("cvat");

        ActionEntity action = new ActionEntity();
        action.setId(actionId);
        action.setDecision(decision);
        action.setActionType(actionType);
        return action;
    }
}
