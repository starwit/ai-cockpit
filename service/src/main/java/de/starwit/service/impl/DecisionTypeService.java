package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.repository.DecisionTypeRepository;

/**
 * 
 * DecisionType Service class
 *
 */
@Service
public class DecisionTypeService
        implements ServiceInterface<DecisionTypeEntity, DecisionTypeRepository> {

    @Autowired
    private DecisionTypeRepository decisiontypeRepository;

    @Override
    public DecisionTypeRepository getRepository() {
        return decisiontypeRepository;
    }

    public DecisionTypeEntity findByName(String name, Long moduleId) {
        return decisiontypeRepository.findFirstByNameLikeAndModuleId(name, moduleId);
    }

    public List<DecisionTypeEntity> findByModule(Long moduleId) {
        return decisiontypeRepository.findByModuleId(moduleId);
    }

    public DecisionTypeEntity findFirstByNameLikeAndModuleId(String name, Long moduleId) {
        return decisiontypeRepository.findFirstByNameLikeAndModuleId(name, moduleId);
    }

}
