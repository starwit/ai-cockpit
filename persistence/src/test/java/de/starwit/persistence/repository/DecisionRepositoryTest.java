package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import de.starwit.persistence.entity.DecisionEntity;

/**
 * Tests for DecisionRepository
 */
@DataJpaTest
public class DecisionRepositoryTest {

    @Autowired
    private DecisionRepository repository;

    @Test
    public void testFindAll() {
        List<DecisionEntity> decisions = repository.findAll();
        assertTrue(decisions.isEmpty());
    }
}
