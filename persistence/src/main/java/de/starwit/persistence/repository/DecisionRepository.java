package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.ModuleEntity;

import java.util.List;

/**
 * Decision Repository class
 */
@Repository
public interface DecisionRepository extends JpaRepository<DecisionEntity, Long> {
    List<DecisionEntity> findByState(DecisionState state);

    List<DecisionEntity> findByModuleId(Long moduleId);

    List<DecisionEntity> findByModuleIdAndState(Long moduleId, DecisionState state);
}
