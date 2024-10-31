package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.service.impl.TrafficIncidentService;
import de.starwit.service.impl.TrafficIncidentTypeService;
import de.starwit.visionapi.Reporting.IncidentMessage;

@Import(TestServiceConfiguration.class)
@SpringBootTest
public class TrafficIncidentServiceTest {

    @Autowired
    private TrafficIncidentService trafficIncidentService;

    @Autowired
    private TrafficIncidentTypeService trafficIncidentTypeService;

    @Test
    void testCreateNewIncidentWithMitigationActionsMessage() {

        // prepare
        IncidentMessage incidentMessage = mock(IncidentMessage.class);
        when(incidentMessage.getMediaUrl()).thenReturn("http://testurl.com/media");
        when(incidentMessage.getTimestampUtcMs()).thenReturn(1633046400000L);

        // Call Methode
        TrafficIncidentEntity result = trafficIncidentService
                .createNewIncidentWithMitigationActionsMessage(incidentMessage);

        // Assert
        assertEquals("http://testurl.com/media", result.getMediaUrl());
        // ZonedDateTime expectedDateTime = Instant.ofEpochMilli(1633046400000L)
        // .atZone(ZoneId.systemDefault());
        // assertEquals(expectedDateTime, result.getAcquisitionTime());
        // assertEquals(1, result.getMitigationAction().size());
        // MitigationActionEntity action =
        // result.getMitigationAction().iterator().next();
        // assertEquals(expectedDateTime, action.getCreationTime());

        // Verify repository interactions
        // verify(trafficIncidentTypeRepository,
        // times(1)).findByName(defaultIncidentType);
        // verify(mitigationActionTypeRepository,
        // times(1)).findByTrafficIncidentType(anyLong());
        // verify(trafficIncidentRepository,
        // times(1)).save(any(TrafficIncidentEntity.class));
    }

    @Test
    void testFindByName() {

        // prepare
        IncidentMessage incidentMessage = mock(IncidentMessage.class);
        when(incidentMessage.getMediaUrl()).thenReturn("http://testurl.com/media");
        when(incidentMessage.getTimestampUtcMs()).thenReturn(1633046400000L);

        TrafficIncidentTypeEntity defaultIncidentType = new TrafficIncidentTypeEntity();
        defaultIncidentType.setName("dangerous driving behaviour");
        trafficIncidentTypeService.saveOrUpdate(defaultIncidentType);

        // Call Methode
        TrafficIncidentEntity result = trafficIncidentService
                .createNewIncidentWithMitigationActionsMessage(incidentMessage);

        TrafficIncidentTypeEntity entity = trafficIncidentService.findIncidentTypeByName("dangerous driving behaviour");
        assertTrue(entity.getName().equals("dangerous driving behaviour"));

    }
}
