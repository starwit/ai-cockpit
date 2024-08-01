package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import de.starwit.persistence.entity.TrafficIncidentTypeEntity;

/**
 * Tests for TrafficIncidentTypeRepository
 */
@SpringBootTest(classes = { de.starwit.persistence.PersistenceApplication.class })
public class TrafficIncidentTypeRepositoryTest {

    @Autowired
    private TrafficIncidentTypeRepository repository;

    @Test
    public void testFindAll() {
        List<TrafficIncidentTypeEntity> trafficincidenttypes = repository.findAll();
        assertTrue(trafficincidenttypes.isEmpty());
    }
}
