package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DecisionEntity;

/**
 * Decision Repository class
 */
@Repository
public interface DecisionRepository extends JpaRepository<DecisionEntity, Long> {

}
