package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.repository.ActionRepository;

/**
 * 
 * Action Service class
 *
 */
@Service
public class ActionService implements ServiceInterface<ActionEntity, ActionRepository> {

    @Autowired
    private ActionRepository actionRepository;

    @Override
    public ActionRepository getRepository() {
        return actionRepository;
    }

    public List<ActionEntity> findAllWithoutDecision() {
        return actionRepository.findAllWithoutDecision();
    }

    public List<ActionEntity> findAllWithoutOtherDecision(Long id) {
        return actionRepository.findAllWithoutOtherDecision(id);
    }

    public List<ActionEntity> findAllWithoutActionType() {
        return actionRepository.findAllWithoutActionType();
    }

    public List<ActionEntity> findAllWithoutOtherActionType(Long id) {
        return actionRepository.findAllWithoutOtherActionType(id);
    }

}
