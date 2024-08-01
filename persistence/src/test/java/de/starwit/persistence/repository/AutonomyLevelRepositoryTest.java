package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import de.starwit.persistence.entity.AutonomyLevelEntity;

/**
 * Tests for AutonomyLevelRepository
 */
@DataJpaTest
public class AutonomyLevelRepositoryTest {

    @Autowired
    private AutonomyLevelRepository repository;

    @Test
    public void testFindAll() {
        List<AutonomyLevelEntity> autonomylevels = repository.findAll();
        assertTrue(autonomylevels.isEmpty());
    }
}
