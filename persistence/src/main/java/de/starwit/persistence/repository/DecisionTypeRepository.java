package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DecisionTypeEntity;

/**
 * DecisionType Repository class
 */
@Repository
public interface DecisionTypeRepository extends JpaRepository<DecisionTypeEntity, Long> {

    public List<DecisionTypeEntity> findByName(String name);

}