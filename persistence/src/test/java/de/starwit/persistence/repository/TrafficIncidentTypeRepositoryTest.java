package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import de.starwit.persistence.entity.TrafficIncidentTypeEntity;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/**
 * Tests for TrafficIncidentTypeRepository
 */
@DataJpaTest
public class TrafficIncidentTypeRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TrafficIncidentTypeRepository repository;

    @Test
    public void testFindAll() {
        List<TrafficIncidentTypeEntity> trafficincidenttypes = repository.findAll();
        assertTrue(trafficincidenttypes.isEmpty());
    }
}
