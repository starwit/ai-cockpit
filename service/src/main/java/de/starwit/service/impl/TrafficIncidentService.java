package de.starwit.service.impl;
import java.util.List;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.repository.MitigationActionRepository;

/**
 * 
 * TrafficIncident Service class
 *
 */
@Service
public class TrafficIncidentService implements ServiceInterface<TrafficIncidentEntity, TrafficIncidentRepository> {

    @Autowired
    private TrafficIncidentRepository trafficincidentRepository;

    @Autowired
    private MitigationActionRepository mitigationactionRepository;

    @Override
    public TrafficIncidentRepository getRepository() {
        return trafficincidentRepository;
    }

    public List<TrafficIncidentEntity> findAllWithoutTrafficIncidentType() {
        return trafficincidentRepository.findAllWithoutTrafficIncidentType();
    }

    public List<TrafficIncidentEntity> findAllWithoutOtherTrafficIncidentType(Long id) {
        return trafficincidentRepository.findAllWithoutOtherTrafficIncidentType(id);
    }

    @Override
    public TrafficIncidentEntity saveOrUpdate(TrafficIncidentEntity entity) {

        Set<MitigationActionEntity> mitigationActionToSave = entity.getMitigationAction();

        if (entity.getId() != null) {
            TrafficIncidentEntity entityPrev = this.findById(entity.getId());
            for (MitigationActionEntity item : entityPrev.getMitigationAction()) {
                MitigationActionEntity existingItem = mitigationactionRepository.getById(item.getId());
                existingItem.setTrafficIncident(null);
                this.mitigationactionRepository.save(existingItem);
            }
        }

        entity.setMitigationAction(null);
        entity = this.getRepository().save(entity);
        this.getRepository().flush();

        if (mitigationActionToSave != null && !mitigationActionToSave.isEmpty()) {
            for (MitigationActionEntity item : mitigationActionToSave) {
                MitigationActionEntity newItem = mitigationactionRepository.getById(item.getId());
                newItem.setTrafficIncident(entity);
                mitigationactionRepository.save(newItem);
            }
        }
        return this.getRepository().getById(entity.getId());
    }
}
