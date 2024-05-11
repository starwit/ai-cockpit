package de.starwit.persistence.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.TrafficIncidentEntity;

/**
 * TrafficIncident Repository class
 */
@Repository
public interface TrafficIncidentRepository extends JpaRepository<TrafficIncidentEntity, Long> {

    @Query("SELECT e FROM TrafficIncidentEntity e WHERE NOT EXISTS (SELECT r FROM e.trafficIncidentType r)")
    public List<TrafficIncidentEntity> findAllWithoutTrafficIncidentType();

    @Query("SELECT e FROM TrafficIncidentEntity e WHERE NOT EXISTS (SELECT r FROM e.trafficIncidentType r WHERE r.id <> ?1)")
    public List<TrafficIncidentEntity> findAllWithoutOtherTrafficIncidentType(Long id);
}
