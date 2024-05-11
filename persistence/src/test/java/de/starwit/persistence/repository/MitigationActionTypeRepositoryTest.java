package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import de.starwit.persistence.entity.MitigationActionTypeEntity;

/**
 * Tests for MitigationActionTypeRepository
 */
@DataJpaTest
public class MitigationActionTypeRepositoryTest {

    @Autowired
    private MitigationActionTypeRepository repository;

    @Test
    public void testFindAll() {
        List<MitigationActionTypeEntity> mitigationactiontypes = repository.findAll();
        assertTrue(mitigationactiontypes.isEmpty());
    }
}
