package de.starwit.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.repository.ActionTypeRepository;
import jakarta.validation.Valid;

@Service
public class ActionTypeService
        implements ServiceInterface<ActionTypeEntity, ActionTypeRepository> {

    static final Logger LOG = LoggerFactory.getLogger(ActionTypeService.class);

    @Autowired
    private ActionTypeRepository actiontypeRepository;

    @Override
    public ActionTypeRepository getRepository() {
        return actiontypeRepository;
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
}
