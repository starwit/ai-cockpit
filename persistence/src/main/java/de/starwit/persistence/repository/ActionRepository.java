package de.starwit.persistence.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.ActionEntity;

/**
 * Action Repository class
 */
@Repository
public interface ActionRepository extends JpaRepository<ActionEntity, Long> {

    @Query("SELECT e FROM ActionEntity e WHERE NOT EXISTS (SELECT r FROM e.decision r)")
    public List<ActionEntity> findAllWithoutDecision();

    @Query("SELECT e FROM ActionEntity e WHERE NOT EXISTS (SELECT r FROM e.decision r WHERE r.id <> ?1)")
    public List<ActionEntity> findAllWithoutOtherDecision(Long id);

    @Query("SELECT e FROM ActionEntity e WHERE NOT EXISTS (SELECT r FROM e.actionType r)")
    public List<ActionEntity> findAllWithoutActionType();

    @Query("SELECT e FROM ActionEntity e WHERE NOT EXISTS (SELECT r FROM e.actionType r WHERE r.id <> ?1)")
    public List<ActionEntity> findAllWithoutOtherActionType(Long id);
}
