package de.starwit.service.impl;

import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;

@Service
public class ActionExecutorService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ActionService actionService;

    static final Logger LOG = LoggerFactory.getLogger(ActionExecutorService.class);

    @Async
    public CompletableFuture<ActionState> sendAction(ActionEntity actionEntity) {
        try {
            String endpoint = actionEntity.getActionType().getEndpoint();
            String requestContent = actionEntity.getMetadata();
            LOG.info("Sending action request to remote URI " + endpoint);
            LOG.debug("Request body: " + requestContent);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);

            RequestEntity<Void> requestEntity = RequestEntity.get(endpoint + "/" + requestContent).build();
            ResponseEntity<byte[]> response = restTemplate.exchange(requestEntity, byte[].class);

            if (response.getStatusCode().is2xxSuccessful()) {
                LOG.info("Successfully saved message");
                actionEntity.setState(ActionState.DONE);
                actionService.saveOrUpdate(actionEntity);

            } else {
                LOG.error("NOT FOUND, Can't send request to remote URI " + endpoint);
                actionEntity.setState(ActionState.CANCELED);
            }
        } catch (Exception e) {
            LOG.error("Can't send request to remote URI " + e.getMessage());
            actionEntity.setState(ActionState.CANCELED);
        }
        return CompletableFuture.completedFuture(actionEntity.getState());
    }
}
