package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.MitigationActionTypeEntity;

/**
 * MitigationActionType Repository class
 */
@Repository
public interface MitigationActionTypeRepository extends JpaRepository<MitigationActionTypeEntity, Long> {

}
