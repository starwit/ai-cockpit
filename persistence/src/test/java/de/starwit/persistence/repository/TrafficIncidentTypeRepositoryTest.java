package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;

/**
 * Tests for TrafficIncidentTypeRepository
 */
@DataJpaTest
public class TrafficIncidentTypeRepositoryTest {

    @Autowired
    private TrafficIncidentTypeRepository incidentTypeRepository;

    @Autowired
    private TrafficIncidentRepository incidentRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testFindAll() {
        List<TrafficIncidentTypeEntity> trafficincidenttypes = incidentTypeRepository.findAll();
        assertTrue(trafficincidenttypes.isEmpty());
    }

    @Test
    public void testCreateUpdate() {

        TrafficIncidentTypeEntity incidentType = saveIncidentType();

        saveIncident();

        entityManager.clear();

        List<TrafficIncidentTypeEntity> incidentTypes = incidentTypeRepository.findAll();
        Set<TrafficIncidentEntity> newIncidents = incidentTypes.get(0).getTrafficIncident();
        assertEquals(1, incidentTypes.size());
        assertEquals(1, newIncidents.size());
        TrafficIncidentEntity incidentUnderTest = incidentTypes.get(0).getTrafficIncident()
                .toArray(new TrafficIncidentEntity[1])[0];
        assertEquals("Traffic jam on Goethestraße in Berlin", incidentUnderTest.getDescription());
        assertEquals(incidentType.getId(), incidentUnderTest.getTrafficIncidentType().getId());

    }

    private TrafficIncidentTypeEntity saveIncidentType() {
        List<TrafficIncidentTypeEntity> incidentTypes = incidentTypeRepository.findAll();
        assertTrue(incidentTypes.isEmpty());
        TrafficIncidentTypeEntity incidentType = new TrafficIncidentTypeEntity();
        incidentType.setName("traffic jam");
        incidentType.setDescription("average speed in the last 10 Minutes is lower than 10 km/h.");
        incidentType = incidentTypeRepository.save(incidentType);

        return incidentType;
    }

    private void saveIncident() {

        entityManager.clear();

        List<TrafficIncidentTypeEntity> incidentTypes = incidentTypeRepository.findAll();
        assertNotNull(incidentTypes);
        assertEquals(1, incidentTypes.size());

        TrafficIncidentEntity incident = new TrafficIncidentEntity();
        incident.setTrafficIncidentType(incidentTypes.get(0));
        incident.setDescription("Traffic jam on Goethestraße in Berlin");
        incident = incidentRepository.save(incident);
        List<TrafficIncidentEntity> incidents = incidentRepository.findAll();
        assertNotNull(incidents);
        assertEquals(1, incidents.size());
    }
}
