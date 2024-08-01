package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import de.starwit.persistence.entity.MitigationActionEntity;

/**
 * Tests for MitigationActionRepository
 */
@DataJpaTest
public class MitigationActionRepositoryTest {

    @Autowired
    private MitigationActionRepository repository;

    @Test
    public void testFindAll() {
        List<MitigationActionEntity> mitigationactions = repository.findAll();
        assertTrue(mitigationactions.isEmpty());
    }
}
