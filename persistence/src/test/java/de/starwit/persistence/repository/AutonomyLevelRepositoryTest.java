package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import de.starwit.persistence.entity.AutonomyLevelEntity;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/**
 * Tests for AutonomyLevelRepository
 */
@DataJpaTest
public class AutonomyLevelRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AutonomyLevelRepository repository;

    @Test
    public void testFindAll() {
        List<AutonomyLevelEntity> autonomylevels = repository.findAll();
        assertTrue(autonomylevels.isEmpty());
    }
}
