package de.starwit.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import de.starwit.persistence.repository.TrafficIncidentTypeRepository;
import jakarta.validation.Valid;

/**
 * 
 * TrafficIncidentType Service class
 *
 */
@Service
public class TrafficIncidentTypeService
        implements ServiceInterface<TrafficIncidentTypeEntity, TrafficIncidentTypeRepository> {

    @Autowired
    private TrafficIncidentTypeRepository trafficincidenttypeRepository;

    @Autowired
    private TrafficIncidentRepository trafficincidentRepository;

    @Override
    public TrafficIncidentTypeRepository getRepository() {
        return trafficincidenttypeRepository;
    }

    @Override
    public TrafficIncidentTypeEntity saveOrUpdate(TrafficIncidentTypeEntity entity) {

        Set<TrafficIncidentEntity> trafficIncidentToSave = entity.getTrafficIncident();

        if (entity.getId() != null) {
            TrafficIncidentTypeEntity entityPrev = this.findById(entity.getId());
            for (TrafficIncidentEntity item : entityPrev.getTrafficIncident()) {
                TrafficIncidentEntity existingItem = trafficincidentRepository.getReferenceById(item.getId());
                existingItem.setTrafficIncidentType(null);
                this.trafficincidentRepository.save(existingItem);
            }
        }

        entity.setTrafficIncident(null);
        entity = this.getRepository().save(entity);
        this.getRepository().flush();

        if (trafficIncidentToSave != null && !trafficIncidentToSave.isEmpty()) {
            for (TrafficIncidentEntity item : trafficIncidentToSave) {
                TrafficIncidentEntity newItem = trafficincidentRepository.getReferenceById(item.getId());
                newItem.setTrafficIncidentType(entity);
                trafficincidentRepository.save(newItem);
            }
        }
        return this.getRepository().getReferenceById(entity.getId());
    }

    public void saveOrUpdateList(@Valid List<TrafficIncidentTypeEntity> entityList) {
        LOG.debug("save or updating list with " + entityList.size() + " items");
        for (TrafficIncidentTypeEntity incidentType : entityList) {
            saveOrUpdate(incidentType);
        }
    }

}
