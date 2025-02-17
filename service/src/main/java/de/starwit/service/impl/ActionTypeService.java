package de.starwit.service.impl;

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionTypeRepository;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.repository.ActionRepository;

@Service
public class ActionTypeService
        implements ServiceInterface<ActionTypeEntity, ActionTypeRepository> {

    static final Logger LOG = LoggerFactory.getLogger(ActionTypeService.class);

    @Autowired
    private ActionTypeRepository actiontypeRepository;

    @Autowired
    private ActionRepository actionRepository;

    @Override
    public ActionTypeRepository getRepository() {
        return actiontypeRepository;
    }

    @Override
    public ActionTypeEntity saveOrUpdate(ActionTypeEntity entity) {

        Set<ActionEntity> actionToSave = entity.getAction();

        if (entity.getId() != null) {
            ActionTypeEntity entityPrev = this.findById(entity.getId());
            for (ActionEntity item : entityPrev.getAction()) {
                ActionEntity existingItem = actionRepository.getReferenceById(item.getId());
                existingItem.setActionType(null);
                this.actionRepository.save(existingItem);
            }
        }

        entity.setAction(null);
        entity = this.getRepository().save(entity);
        this.getRepository().flush();

        if (actionToSave != null && !actionToSave.isEmpty()) {
            for (ActionEntity item : actionToSave) {
                ActionEntity newItem = actionRepository.getReferenceById(item.getId());
                newItem.setActionType(entity);
                actionRepository.save(newItem);
            }
        }
        return this.getRepository().getReferenceById(entity.getId());
    }

    public void saveOrUpdateList(@Valid List<ActionTypeEntity> entityList) {
        LOG.debug("save or updating list with " + entityList.size() + " items");
        for (ActionTypeEntity actionTypeEntity : entityList) {
            saveOrUpdate(actionTypeEntity);
        }
    }

    public List<ActionTypeEntity> findByDecisionType(Long decisionTypeId) {
        return actiontypeRepository.findByDecisionType(decisionTypeId);
    }

    public List<ActionTypeEntity> findByName(String name) {
        return actiontypeRepository.findByName(name);
    }

    public List<ActionTypeEntity> findByModule(ModuleEntity module) {
        return actiontypeRepository.findByModule(module);
    }
}
