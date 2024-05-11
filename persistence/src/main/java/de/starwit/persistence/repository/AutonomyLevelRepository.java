package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.AutonomyLevelEntity;

/**
 * AutonomyLevel Repository class
 */
@Repository
public interface AutonomyLevelRepository extends JpaRepository<AutonomyLevelEntity, Long> {

}
