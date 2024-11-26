package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.repository.MitigationActionRepository;

/**
 * 
 * MitigationAction Service class
 *
 */
@Service
public class MitigationActionService implements ServiceInterface<MitigationActionEntity, MitigationActionRepository> {

    @Autowired
    private MitigationActionRepository mitigationactionRepository;

    @Override
    public MitigationActionRepository getRepository() {
        return mitigationactionRepository;
    }

    public List<MitigationActionEntity> findAllWithoutDecision() {
        return mitigationactionRepository.findAllWithoutDecision();
    }

    public List<MitigationActionEntity> findAllWithoutOtherDecision(Long id) {
        return mitigationactionRepository.findAllWithoutOtherDecision(id);
    }

    public List<MitigationActionEntity> findAllWithoutMitigationActionType() {
        return mitigationactionRepository.findAllWithoutMitigationActionType();
    }

    public List<MitigationActionEntity> findAllWithoutOtherMitigationActionType(Long id) {
        return mitigationactionRepository.findAllWithoutOtherMitigationActionType(id);
    }

}
