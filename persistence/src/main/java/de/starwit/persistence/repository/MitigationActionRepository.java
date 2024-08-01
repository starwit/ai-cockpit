package de.starwit.persistence.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.MitigationActionEntity;

/**
 * MitigationAction Repository class
 */
@Repository
public interface MitigationActionRepository extends JpaRepository<MitigationActionEntity, Long> {

    @Query("SELECT e FROM MitigationActionEntity e WHERE NOT EXISTS (SELECT r FROM e.trafficIncident r)")
    public List<MitigationActionEntity> findAllWithoutTrafficIncident();

    @Query("SELECT e FROM MitigationActionEntity e WHERE NOT EXISTS (SELECT r FROM e.trafficIncident r WHERE r.id <> ?1)")
    public List<MitigationActionEntity> findAllWithoutOtherTrafficIncident(Long id);

    @Query("SELECT e FROM MitigationActionEntity e WHERE NOT EXISTS (SELECT r FROM e.mitigationActionType r)")
    public List<MitigationActionEntity> findAllWithoutMitigationActionType();

    @Query("SELECT e FROM MitigationActionEntity e WHERE NOT EXISTS (SELECT r FROM e.mitigationActionType r WHERE r.id <> ?1)")
    public List<MitigationActionEntity> findAllWithoutOtherMitigationActionType(Long id);
}
