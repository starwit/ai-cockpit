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
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import de.starwit.persistence.repository.TrafficIncidentTypeRepository;
import de.starwit.service.impl.TrafficIncidentService;
import de.starwit.service.impl.TrafficIncidentTypeService;
import de.starwit.visionapi.Reporting.IncidentMessage;

@Import(TestServiceConfiguration.class)
@Transactional
@SpringBootTest
public class TrafficIncidentServiceTest {

    @Autowired
    TrafficIncidentTypeRepository trafficIncidentTypeRepository;

    @Autowired
    MitigationActionTypeRepository mitigationActionTypeRepository;

    @Autowired
    private TrafficIncidentService trafficIncidentService;

    @Autowired
    private TrafficIncidentTypeService trafficIncidentTypeService;

    @Test
    @Commit
    @Order(1)
    void testCreateTypes() {
        TrafficIncidentTypeEntity defaultIncidentType = new TrafficIncidentTypeEntity();
        defaultIncidentType.setName("dangerous driving behaviour");
        MitigationActionTypeEntity actionType = new MitigationActionTypeEntity();
        actionType.setDescription("Notify public platforms or apps about the traffic incident");
        actionType.setName("notify public platform");
        actionType.setExecutionPolicy(ExecutionPolicies.AUTOMATIC);
        actionType = mitigationActionTypeRepository.save(actionType);

        Set<MitigationActionTypeEntity> mitigationActionTypes = new HashSet<>();
        defaultIncidentType.setMitigationActionType(mitigationActionTypes);
        mitigationActionTypes.add(actionType);
        defaultIncidentType = trafficIncidentTypeService.saveOrUpdate(defaultIncidentType);

    }

    @Test
    @Commit
    @Order(2)
    void testCreateNewIncidentWithMitigationActionsMessage() {

        // prepare
        long timestamp = 1633046400000L;
        IncidentMessage incidentMessage = mock(IncidentMessage.class);
        when(incidentMessage.getMediaUrl()).thenReturn("http://testurl.com/media");
        when(incidentMessage.getTimestampUtcMs()).thenReturn(timestamp);

        // Call Methode
        TrafficIncidentEntity result = trafficIncidentService
                .createNewIncidentBasedOnIncidentMessage(incidentMessage);

        // Assert
        assertEquals("http://testurl.com/media", result.getMediaUrl());
        ZonedDateTime expectedDateTime = Instant.ofEpochMilli(timestamp)
                .atZone(ZoneId.systemDefault());
        assertTrue(expectedDateTime.isEqual(result.getAcquisitionTime()));
        assertEquals(expectedDateTime, result.getAcquisitionTime());
        assertEquals(1, result.getMitigationAction().size());
        MitigationActionEntity action = result.getMitigationAction().iterator().next();
        assertTrue(expectedDateTime.isEqual(action.getCreationTime()));
    }

    @Test
    void testFindByName() {
        // prepare
        TrafficIncidentTypeEntity defaultIncidentType = new TrafficIncidentTypeEntity();
        defaultIncidentType.setName("dangerous driving behaviour");
        trafficIncidentTypeService.saveOrUpdate(defaultIncidentType);

        // Call-Methode
        TrafficIncidentTypeEntity entity = trafficIncidentService.findIncidentTypeByName("dangerous driving behaviour");

        // Assert
        assertTrue(entity.getName().equals("dangerous driving behaviour"));

    }
}
