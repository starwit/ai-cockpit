package de.starwit.persistence.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;

/**
 * Action Repository class
 */
@Repository
public interface ActionRepository extends JpaRepository<ActionEntity, Long> {

    @Query("SELECT e FROM ActionEntity e WHERE NOT EXISTS (SELECT r FROM e.decision r)")
    public List<ActionEntity> findAllWithoutDecision();

    public List<ActionEntity> findByState(ActionState state);

    @Query("SELECT e FROM ActionEntity e WHERE e.state like '%NEW%' OR e.state like '%CANCELED%'")
    public List<ActionEntity> findAllNewAndCanceled();
}
