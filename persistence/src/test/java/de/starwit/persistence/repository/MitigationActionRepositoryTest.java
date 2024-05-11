package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import de.starwit.persistence.entity.MitigationActionEntity;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/**
 * Tests for MitigationActionRepository
 */
@DataJpaTest
public class MitigationActionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MitigationActionRepository repository;

    @Test
    public void testFindAll() {
        List<MitigationActionEntity> mitigationactions = repository.findAll();
        assertTrue(mitigationactions.isEmpty());
    }
}
