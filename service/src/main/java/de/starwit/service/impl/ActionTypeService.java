package de.starwit.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.repository.ActionTypeRepository;

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

    public List<ActionTypeEntity> findByDecisionType(Long decisionTypeId) {
        return actiontypeRepository.findByDecisionType(decisionTypeId);
    }

    public List<ActionTypeEntity> findByName(String name) {
        return actiontypeRepository.findByName(name);
    }

    public List<ActionTypeEntity> findByModule(Long moduleId) {
        return actiontypeRepository.findByModuleId(moduleId);
    }
}
