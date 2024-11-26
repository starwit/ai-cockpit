package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.persistence.entity.ExecutionPolicies;
import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.impl.DecisionTypeService;
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
        actionType.setExecutionPolicy(ExecutionPolicies.AUTOMATIC);
        actionType = actionTypeRepository.save(actionType);

        Set<ActionTypeEntity> actionTypes = new HashSet<>();
        defaultDecisionType.setActionType(actionTypes);
        actionTypes.add(actionType);
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
        assertEquals(1, result.getAction().size());
        ActionEntity action = result.getAction().iterator().next();
        assertTrue(expectedDateTime.isEqual(action.getCreationTime()));
    }

    @Test
    void testFindByName() {
        // prepare
        DecisionTypeEntity defaultDecisionType = new DecisionTypeEntity();
        defaultDecisionType.setName("dangerous driving behaviour");
        decisionTypeService.saveOrUpdate(defaultDecisionType);

        // Call-Methode
        DecisionTypeEntity entity = decisionService.findDecisionTypeByName("dangerous driving behaviour");

        // Assert
        assertTrue(entity.getName().equals("dangerous driving behaviour"));

    }
}
