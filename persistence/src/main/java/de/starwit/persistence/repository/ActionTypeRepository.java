package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;

/**
 * ActionType Repository class
 */
@Repository
public interface ActionTypeRepository extends JpaRepository<ActionTypeEntity, Long> {

    @Query("SELECT e FROM ActionTypeEntity e WHERE ?1 in (SELECT r.id FROM e.decisionType r)")
    List<ActionTypeEntity> findByDecisionType(Long decisionTypeId);

    public List<ActionTypeEntity> findByName(String name);

    public List<ActionTypeEntity> findByModule(ModuleEntity module);
}
