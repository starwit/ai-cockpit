package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.persistence.repository.ActionRepository;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.impl.DecisionTypeService;
import de.starwit.visionapi.Common.GeoCoordinate;
import de.starwit.visionapi.Reporting.IncidentMessage;

@Import(TestServiceConfiguration.class)
@Transactional
@SpringBootTest
public class DecisionServiceTest {

    @Autowired
    DecisionTypeRepository decisionTypeRepository;

    @Autowired
    ActionTypeRepository actionTypeRepository;

    @Autowired
    ActionRepository actionRepository;

    @Autowired
    private DecisionService decisionService;

    @Autowired
    private DecisionTypeService decisionTypeService;

    @Test
    @Commit
    @Order(1)
    void testCreateTypes() {
        DecisionTypeEntity defaultDecisionType = new DecisionTypeEntity();
        defaultDecisionType.setName("dangerous driving behaviour");
        ActionTypeEntity actionType = new ActionTypeEntity();
        actionType.setDescription("Notify public platforms or apps about the traffic decision");
        actionType.setName("notify public platform");
        actionType.setExecutionPolicy(ExecutionPolicy.AUTOMATIC);
        actionType = actionTypeRepository.save(actionType);

        ActionTypeEntity actionType2 = new ActionTypeEntity();
        actionType2.setDescription("Notify police");
        actionType2.setName("notify police");
        actionType2.setExecutionPolicy(ExecutionPolicy.WITHCHECK);
        actionType2 = actionTypeRepository.save(actionType2);

        Set<ActionTypeEntity> actionTypes = new HashSet<>();
        defaultDecisionType.setActionType(actionTypes);
        actionTypes.add(actionType);
        actionTypes.add(actionType2);
        defaultDecisionType = decisionTypeService.saveOrUpdate(defaultDecisionType);
    }

    @Test
    @Commit
    @Order(2)
    void testCreateNewDecisionWithActionsMessage() {

        // prepare
        long timestamp = 1633046400000L;
        IncidentMessage decisionMessage = mock(IncidentMessage.class);
        when(decisionMessage.getMediaUrl()).thenReturn("http://testurl.com/media");
        when(decisionMessage.getTimestampUtcMs()).thenReturn(timestamp);

        // Call Methode
        DecisionEntity result = decisionService
                .createNewDecisionBasedOnIncidentMessage(decisionMessage);

        // Assert
        assertEquals("http://testurl.com/media", result.getMediaUrl());
        ZonedDateTime expectedDateTime = Instant.ofEpochMilli(timestamp)
                .atZone(ZoneId.systemDefault());
        assertTrue(expectedDateTime.isEqual(result.getAcquisitionTime()));
        assertEquals(expectedDateTime, result.getAcquisitionTime());
        assertEquals(2, result.getAction().size());
        ActionEntity action = result.getAction().iterator().next();
        assertTrue(expectedDateTime.isEqual(action.getCreationTime()));
    }

    @Test
    @Commit
    @Order(5)
    void testCreateNewDecisionWithGeoLocation() {

        // prepare
        long timestamp = 1633046400000L;
        IncidentMessage decisionMessage = mock(IncidentMessage.class);
        when(decisionMessage.getMediaUrl()).thenReturn("http://testurl.com/media");
        when(decisionMessage.getTimestampUtcMs()).thenReturn(timestamp);
        when(decisionMessage.getCameraLocation()).thenReturn(mock(GeoCoordinate.class));
        when(decisionMessage.getCameraLocation().getLatitude()).thenReturn(38.97);
        when(decisionMessage.getCameraLocation().getLongitude()).thenReturn(40.78);

        // Call Methode
        DecisionEntity result = decisionService
                .createNewDecisionBasedOnIncidentMessage(decisionMessage);

        // Assert
        assertEquals(new BigDecimal(38.97), result.getCameraLatitude());
        assertEquals(new BigDecimal(40.78), result.getCameraLongitude());
    }

    @Test
    @Commit
    @Order(3)
    void testCreateNewDecisionWithActions() {

        // prepare
        long timestamp = 1633046400000L;
        DecisionEntity decision = new DecisionEntity();
        ZonedDateTime expectedDateTime = Instant.ofEpochMilli(timestamp)
                .atZone(ZoneId.systemDefault());
        decision.setMediaUrl("http://testurl.com/media");
        decision.setAcquisitionTime(expectedDateTime);
        decision.setDecisionType(decisionTypeService.findAll().iterator().next());

        // Call Methode
        DecisionEntity result = decisionService
                .createDecisionEntitywithAction(decision);

        // Assert
        assertEquals("http://testurl.com/media", result.getMediaUrl());
        assertEquals(2, result.getAction().size());
        ActionEntity action = result.getAction().iterator().next();
        assertTrue(expectedDateTime.isEqual(action.getCreationTime()));
    }

    @Test
    @Commit
    @Order(4)
    void testUpdateDecisionWithActions() {

        // prepare
        ActionTypeEntity actionType = new ActionTypeEntity();
        actionType.setDescription("New Action");
        actionType.setName("\"New Action");
        actionType.setExecutionPolicy(ExecutionPolicy.WITHCHECK);
        actionType = actionTypeRepository.save(actionType);

        DecisionEntity decision = decisionService.findAll().get(0);
        Set<ActionEntity> actions = decision.getAction();

        decision.setState(DecisionState.ACCEPTED);
        Set<Long> removedActionTypeIds = new HashSet<>();
        removedActionTypeIds.add(actions.iterator().next().getId());

        Set<Long> addedActionTypeIds = new HashSet<>();
        addedActionTypeIds.add(actionType.getId());

        // Call Methode
        DecisionEntity result = decisionService.UpdateDecisionEntityWithAction(decision, addedActionTypeIds,
                removedActionTypeIds);

        // Assert
        actions = result.getAction();
        List<Long> resultActionTypeIds = new ArrayList<>();
        for (ActionEntity action : actions) {
            resultActionTypeIds.add(action.getActionType().getId());
        }

        assertEquals(2, resultActionTypeIds.size());
        assertTrue(resultActionTypeIds.containsAll(addedActionTypeIds));
        resultActionTypeIds.retainAll(removedActionTypeIds);
        assertEquals(0, resultActionTypeIds.size());
        assertEquals(DecisionState.ACCEPTED, result.getState());

        List<ActionEntity> actionsWithoutDecisions = actionRepository.findAllWithoutDecision();
        assertEquals(0, actionsWithoutDecisions.size());
    }

    @Test
    void testFindByName() {
        // prepare
        DecisionTypeEntity defaultDecisionType = new DecisionTypeEntity();
        defaultDecisionType.setName("Testname");
        decisionTypeService.saveOrUpdate(defaultDecisionType);

        // Call-Methode
        DecisionTypeEntity entity = decisionService.findDecisionTypeByName("Testname");

        // Assert
        assertTrue(entity.getName().equals("Testname"));

    }
}
