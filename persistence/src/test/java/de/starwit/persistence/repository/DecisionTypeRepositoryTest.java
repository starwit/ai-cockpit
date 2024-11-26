package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;

/**
 * Tests for DecisionTypeRepository
 */
@DataJpaTest
public class DecisionTypeRepositoryTest {

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testFindAll() {
        List<DecisionTypeEntity> decisiontypes = decisionTypeRepository.findAll();
        assertTrue(decisiontypes.isEmpty());
    }

    @Test
    public void testCreateUpdate() {

        DecisionTypeEntity decisionType = saveDecisionType();

        saveDecision();

        entityManager.clear();

        List<DecisionTypeEntity> decisionTypes = decisionTypeRepository.findAll();
        Set<DecisionEntity> newDecisions = decisionTypes.get(0).getDecision();
        assertEquals(1, decisionTypes.size());
        assertEquals(1, newDecisions.size());
        DecisionEntity decisionUnderTest = decisionTypes.get(0).getDecision()
                .toArray(new DecisionEntity[1])[0];
        assertEquals("Traffic jam on Goethestraße in Berlin", decisionUnderTest.getDescription());
        assertEquals(decisionType.getId(), decisionUnderTest.getDecisionType().getId());

    }

    private DecisionTypeEntity saveDecisionType() {
        List<DecisionTypeEntity> decisionTypes = decisionTypeRepository.findAll();
        assertTrue(decisionTypes.isEmpty());
        DecisionTypeEntity decisionType = new DecisionTypeEntity();
        decisionType.setName("traffic jam");
        decisionType.setDescription("average speed in the last 10 Minutes is lower than 10 km/h.");
        decisionType = decisionTypeRepository.save(decisionType);

        return decisionType;
    }

    private void saveDecision() {

        entityManager.clear();

        List<DecisionTypeEntity> decisionTypes = decisionTypeRepository.findAll();
        assertNotNull(decisionTypes);
        assertEquals(1, decisionTypes.size());

        DecisionEntity decision = new DecisionEntity();
        decision.setDecisionType(decisionTypes.get(0));
        decision.setDescription("Traffic jam on Goethestraße in Berlin");
        decision = decisionRepository.save(decision);
        List<DecisionEntity> decisions = decisionRepository.findAll();
        assertNotNull(decisions);
        assertEquals(1, decisions.size());
    }
}
