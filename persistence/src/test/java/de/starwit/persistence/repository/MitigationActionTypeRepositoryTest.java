package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import de.starwit.persistence.entity.MitigationActionTypeEntity;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/**
 * Tests for MitigationActionTypeRepository
 */
@DataJpaTest
public class MitigationActionTypeRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MitigationActionTypeRepository repository;

    @Test
    public void testFindAll() {
        List<MitigationActionTypeEntity> mitigationactiontypes = repository.findAll();
        assertTrue(mitigationactiontypes.isEmpty());
    }
}
