package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DecisionEntity;

/**
 * Decision Repository class
 */
@Repository
public interface DecisionRepository extends JpaRepository<DecisionEntity, Long> {

    @Query("SELECT e FROM DecisionEntity e WHERE NOT EXISTS (SELECT r FROM e.decisionType r)")
    public List<DecisionEntity> findAllWithoutDecisionType();

    @Query("SELECT e FROM DecisionEntity e WHERE NOT EXISTS (SELECT r FROM e.decisionType r WHERE r.id <> ?1)")
    public List<DecisionEntity> findAllWithoutOtherDecisionType(Long id);

}
