package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;
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

    public List<ActionEntity> findAllNewActions() {
        List<ActionEntity> result = actionRepository.findByState(ActionState.NEW);
        return result;
    }

    public List<ActionEntity> findAllNewAndCanceled() {
        List<ActionEntity> result = actionRepository.findAllNewAndCanceled();
        return result;

    }
}
