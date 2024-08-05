package de.starwit.service.impl;

import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.repository.MitigationActionRepository;

@Service
public class MitigationActionTypeService
        implements ServiceInterface<MitigationActionTypeEntity, MitigationActionTypeRepository> {

    static final Logger LOG = LoggerFactory.getLogger(MitigationActionTypeService.class);

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

    public void saveOrUpdateList(@Valid List<MitigationActionTypeEntity> entityList) {
        LOG.debug("save or updating list with " + entityList.size() + " items");
        for (MitigationActionTypeEntity mitigationActionTypeEntity : entityList) {
            saveOrUpdate(mitigationActionTypeEntity);
        }
    }
}
