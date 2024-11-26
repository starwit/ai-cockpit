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
}
