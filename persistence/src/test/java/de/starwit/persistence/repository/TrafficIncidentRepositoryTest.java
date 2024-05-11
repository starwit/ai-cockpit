package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import de.starwit.persistence.entity.TrafficIncidentEntity;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/**
 * Tests for TrafficIncidentRepository
 */
@DataJpaTest
public class TrafficIncidentRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TrafficIncidentRepository repository;

    @Test
    public void testFindAll() {
        List<TrafficIncidentEntity> trafficincidents = repository.findAll();
        assertTrue(trafficincidents.isEmpty());
    }
}
