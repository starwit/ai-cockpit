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
import de.starwit.service.impl.ActionService;
import de.starwit.service.impl.CvatExportService;
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

    @Test
    void deletesTaskWhenUploadFailsAfterCreation() throws Exception {
        ReflectionTestUtils.setField(cvatExportService, "cvatBaseUrl", "http://cvat:8080");
        ReflectionTestUtils.setField(cvatExportService, "cvatToken", "token");
        ReflectionTestUtils.setField(cvatExportService, "cvatProjectId", 1L);
        ReflectionTestUtils.setField(cvatExportService, "cvatOrganizationSlug", "Starwit");

        ModuleEntity module = new ModuleEntity();
        module.setId(1L);

        DecisionEntity decision = new DecisionEntity();
        decision.setId(1L);
        decision.setState(DecisionState.ACCEPTED);
        decision.setModule(module);
        decision.setMediaUrl("bucket/sample/annotated.jpg");

        ActionTypeEntity actionType = new ActionTypeEntity();
        actionType.setExecutionPolicy(ExecutionPolicy.MANUAL);
        actionType.setEndpoint("cvat");

        ActionEntity action = new ActionEntity();
        action.setId(1L);
        action.setDecision(decision);
        action.setActionType(actionType);
        when(actionService.findAllNewActions()).thenReturn(List.of(action));
        when(minioService.getFileFromMinio("bucket", "sample/detections.json"))
                .thenReturn("[]".getBytes(StandardCharsets.UTF_8));

        JsonNode labels = objectMapper.readTree("{\"results\":[]}");
        JsonNode task = objectMapper.readTree("{\"id\":42}");
        when(restTemplate.exchange(any(RequestEntity.class), eq(JsonNode.class)))
                .thenReturn(ResponseEntity.ok(labels))
                .thenReturn(ResponseEntity.ok(task))
                .thenThrow(new RestClientException("upload failed"));

        assertThrows(RestClientException.class, () -> cvatExportService.exportModule(1L));

        ArgumentCaptor<RequestEntity> deleteRequest = ArgumentCaptor.forClass(RequestEntity.class);
        verify(restTemplate).exchange(deleteRequest.capture(), eq(Void.class));
        assertEquals(HttpMethod.DELETE, deleteRequest.getValue().getMethod());
        assertEquals("http://cvat:8080/api/tasks/42", deleteRequest.getValue().getUrl().toString());
        verify(actionService, never()).markCvatExported(any(), any());
    }
}
