package de.starwit.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.repository.MitigationActionRepository;
import de.starwit.persistence.repository.TrafficIncidentRepository;

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

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public TrafficIncidentEntity saveOrUpdate(TrafficIncidentEntity entity) {

        Set<MitigationActionEntity> mitigationActionsToSave = entity.getMitigationAction();
        Set<MitigationActionEntity> mitigationActionsPrev = null;

        if (entity.getId() != null) {
            TrafficIncidentEntity entityPrev = this.findById(entity.getId());
            mitigationActionsPrev = entityPrev.getMitigationAction();
            Set<MitigationActionEntity> toDelete = new HashSet<>();
            toDelete.addAll(mitigationActionsPrev);

            if (mitigationActionsToSave != null && !mitigationActionsToSave.isEmpty()) {
                for (MitigationActionEntity actionToSave : mitigationActionsToSave) {
                    if (actionToSave.getId() == null) {
                        actionToSave.setTrafficIncident(entity);
                        MitigationActionEntity newEntity = mitigationactionRepository.save(actionToSave);
                        actionToSave.setId(newEntity.getId());
                    }
                    if (mitigationActionsPrev != null && !mitigationActionsPrev.isEmpty()) {
                        for (MitigationActionEntity actionPrev : mitigationActionsPrev) {
                            if (actionToSave.getId() == actionPrev.getId()) {
                                toDelete.remove(actionPrev);
                            }
                        }
                    }
                }
            }
            if (!toDelete.isEmpty()) {
                for (MitigationActionEntity delete : toDelete) {
                    delete.setTrafficIncident(null);
                    delete = mitigationactionRepository.save(delete);
                    mitigationactionRepository.deleteById(delete.getId());
                }
            }

            mitigationactionRepository.flush();
            this.getRepository().flush();

            entityPrev.setDescription(entity.getDescription());
            entityPrev.setState(entity.getState());
            entityPrev.setTrafficIncidentType(entity.getTrafficIncidentType());
            // entity = this.getRepository().save(entityPrev);

        } else {
            // entity = this.getRepository().save(entity);
        }
        List<MitigationActionEntity> mitActions = mitigationactionRepository.findAll();
        this.getRepository().flush();
        entity = getRepository().findById(entity.getId()).orElseThrow();
        return entity;
    }
}
