package de.starwit.service;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.redis.testcontainers.RedisContainer;

import de.starwit.persistence.entity.IncidentState;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import de.starwit.persistence.repository.TrafficIncidentTypeRepository;
import de.starwit.service.impl.TrafficIncidentService;
import de.starwit.visionapi.Reporting.IncidentMessage;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;



@RunWith(SpringRunner.class)
@SpringBootTest
public class TrafficIncidentServiceTest {
    
    // private TrafficIncidentRepository trafficIncidentRepository;

    // private TrafficIncidentService trafficIncidentService;


    @Test
    void testCreateNewIncidentWithMitigationActionsMessage() {
        // prepare
        // IncidentMessage incidentMessage = mock(IncidentMessage.class);
        // when(incidentMessage.getMediaUrl()).thenReturn("http://testurl.com/media");
        // when(incidentMessage.getTimestampUtcMs()).thenReturn(1633046400000L); // Example timestamp

        //TrafficIncidentService trafficIncidentService = mock(TrafficIncidentService.class);
        //when(incidentMessage.getMediaUrl()).thenReturn("http://testurl.com/media");


        //Call Methode
        //TrafficIncidentEntity result = trafficIncidentService.createNewIncidentWithMitigationActionsMessage(incidentMessage);

        // Assert
        // assertEquals("http://testurl.com/media", result.getMediaUrl());
        // ZonedDateTime expectedDateTime = Instant.ofEpochMilli(1633046400000L)
        //         .atZone(ZoneId.systemDefault());
        // assertEquals(expectedDateTime, result.getAcquisitionTime());
        // assertEquals(1, result.getMitigationAction().size());
        // MitigationActionEntity action = result.getMitigationAction().iterator().next();
        // assertEquals(expectedDateTime, action.getCreationTime());

        // Verify repository interactions
        // verify(trafficIncidentTypeRepository, times(1)).findByName(defaultIncidentType);
        // verify(mitigationActionTypeRepository, times(1)).findByTrafficIncidentType(anyLong());
        // verify(trafficIncidentRepository, times(1)).save(any(TrafficIncidentEntity.class));
    }
}
