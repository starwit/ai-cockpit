package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.MitigationActionTypeEntity;

/**
 * MitigationActionType Repository class
 */
@Repository
public interface MitigationActionTypeRepository extends JpaRepository<MitigationActionTypeEntity, Long> {

    @Query("SELECT e FROM MitigationActionTypeEntity e WHERE ?1 in (SELECT r.id FROM e.trafficIncidentType r)")
    List<MitigationActionTypeEntity> findByTrafficIncidentType(Long trafficIncidentTypeId);
}
