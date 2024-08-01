package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import de.starwit.persistence.entity.AutonomyLevelEntity;

/**
 * Tests for AutonomyLevelRepository
 */
@SpringBootTest(classes = { de.starwit.persistence.PersistenceApplication.class })
public class AutonomyLevelRepositoryTest {

    @Autowired
    private AutonomyLevelRepository repository;

    @Test
    public void testFindAll() {
        List<AutonomyLevelEntity> autonomylevels = repository.findAll();
        assertTrue(autonomylevels.isEmpty());
    }
}
