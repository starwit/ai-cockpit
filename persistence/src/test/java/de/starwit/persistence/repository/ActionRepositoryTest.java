package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import de.starwit.persistence.entity.ActionEntity;

/**
 * Tests for ActionRepository
 */
@DataJpaTest
public class ActionRepositoryTest {

    @Autowired
    private ActionRepository repository;

    @Test
    public void testFindAll() {
        List<ActionEntity> actions = repository.findAll();
        assertTrue(actions.isEmpty());
    }
}
