package de.starwit.service.impl;
import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.repository.MitigationActionRepository;

/**
 * 
 * MitigationActionType Service class
 *
 */
@Service
public class MitigationActionTypeService implements ServiceInterface<MitigationActionTypeEntity, MitigationActionTypeRepository> {

    @Autowired
    private MitigationActionTypeRepository mitigationactiontypeRepository;

    @Autowired
    private MitigationActionRepository mitigationactionRepository;

    @Override
    public MitigationActionTypeRepository getRepository() {
        return mitigationactiontypeRepository;
    }


    @Override
    public MitigationActionTypeEntity saveOrUpdate(MitigationActionTypeEntity entity) {

        Set<MitigationActionEntity> mitigationActionToSave = entity.getMitigationAction();

        if (entity.getId() != null) {
            MitigationActionTypeEntity entityPrev = this.findById(entity.getId());
            for (MitigationActionEntity item : entityPrev.getMitigationAction()) {
                MitigationActionEntity existingItem = mitigationactionRepository.getReferenceById(item.getId());
                existingItem.setMitigationActionType(null);
                this.mitigationactionRepository.save(existingItem);
            }
        }

        entity.setMitigationAction(null);
        entity = this.getRepository().save(entity);
        this.getRepository().flush();

        if (mitigationActionToSave != null && !mitigationActionToSave.isEmpty()) {
            for (MitigationActionEntity item : mitigationActionToSave) {
                MitigationActionEntity newItem = mitigationactionRepository.getReferenceById(item.getId());
                newItem.setMitigationActionType(entity);
                mitigationactionRepository.save(newItem);
            }
        }
        return this.getRepository().getReferenceById(entity.getId());
    }
}
