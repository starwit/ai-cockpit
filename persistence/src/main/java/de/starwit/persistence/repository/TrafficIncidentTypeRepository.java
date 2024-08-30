package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.TrafficIncidentTypeEntity;

/**
 * TrafficIncidentType Repository class
 */
@Repository
public interface TrafficIncidentTypeRepository extends JpaRepository<TrafficIncidentTypeEntity, Long> {

    public List<TrafficIncidentTypeEntity> findByName(String name);

}
