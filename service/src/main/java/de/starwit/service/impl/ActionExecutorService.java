package de.starwit.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.service.Automation;

@Service
public class ActionExecutorService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ActionService actionService;

    @Autowired
    private Automation automation;

    static final Logger LOG = LoggerFactory.getLogger(ActionExecutorService.class);

    @Scheduled(fixedDelayString = "${action.execution.delay:10s}")
    public void executeActions() {
        List<ActionEntity> actions = actionService.findAllNewActions();
        executeActions(actions);
    }

    private void executeActions(List<ActionEntity> actions) {
        if (actions != null && !actions.isEmpty()) {
            for (ActionEntity action : actions) {
                if (automation.getExecutionPolicy().allow(action)) {
                    ExecutionPolicy executionPolicy = action.getActionType().getExecutionPolicy();
                    if (executionPolicy.allow(action)) {
                        generateActionMetadata(action);
                        sendAction(action);
                    }
                }
            }
        }
    }

    private void generateActionMetadata(ActionEntity action) {
        action.setMetadata("| *** "
                + action.getDecision().getDecisionType().getName()
                + " * "
                + action.getActionType().getName()
                + " *** |");
    }

    @Async
    public void retryExecutionActions() {
        List<ActionEntity> actions = actionService.findAllNewAndCanceled();
        executeActions(actions);
    }

    public void sendAction(ActionEntity actionEntity) {
        String endpoint = actionEntity.getActionType().getEndpoint();
        String requestContent = actionEntity.getMetadata();
        DecisionEntity decision = actionEntity.getDecision();
        LOG.info("Sending action request to remote URI " + endpoint);
        LOG.debug("Request body: " + requestContent);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        try {
            if (endpoint != null && endpoint.length() > 4 && decision != null) {
                BigDecimal lat = actionEntity.getDecision().getCameraLatitude();
                BigDecimal lng = actionEntity.getDecision().getCameraLongitude();
                endpoint = endpoint.replace("{coordinates}", lat + "/" + lng);
                endpoint = endpoint.replace("{name}", actionEntity.getActionType().getName());
                endpoint = endpoint.replace("{decisiontype}", actionEntity.getDecision().getDecisionType().getName());
                RequestEntity<Void> requestEntity = RequestEntity.get(endpoint).build();
                ResponseEntity<byte[]> response = restTemplate.exchange(requestEntity, byte[].class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    LOG.info("Successfully saved message");
                    actionEntity.setState(ActionState.DONE);
                } else {
                    LOG.info("NOT FOUND, Can't send request to remote URI " + endpoint);
                    actionEntity.setState(ActionState.CANCELED);
                }
            } else {
                LOG.info("Endpoint is not defined");
                actionEntity.setState(ActionState.CANCELED);
            }
        } catch (Exception e) {
            LOG.info("Can't send request to remote URI " + e.getMessage());
            actionEntity.setState(ActionState.CANCELED);
        }
        actionService.saveOrUpdate(actionEntity);
    }
}
