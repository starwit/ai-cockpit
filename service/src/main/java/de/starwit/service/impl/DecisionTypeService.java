package de.starwit.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.repository.DecisionRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import jakarta.validation.Valid;

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

    @Autowired
    private DecisionRepository decisionRepository;

    @Override
    public DecisionTypeRepository getRepository() {
        return decisiontypeRepository;
    }

    @Override
    public DecisionTypeEntity saveOrUpdate(DecisionTypeEntity entity) {

        Set<DecisionEntity> decisionToSave = entity.getDecision();

        if (entity.getId() != null) {
            DecisionTypeEntity entityPrev = this.findById(entity.getId());
            for (DecisionEntity item : entityPrev.getDecision()) {
                DecisionEntity existingItem = decisionRepository.getReferenceById(item.getId());
                existingItem.setDecisionType(null);
                this.decisionRepository.save(existingItem);
            }
        }

        entity.setDecision(null);
        entity = this.getRepository().save(entity);
        this.getRepository().flush();

        if (decisionToSave != null && !decisionToSave.isEmpty()) {
            for (DecisionEntity item : decisionToSave) {
                DecisionEntity newItem = decisionRepository.getReferenceById(item.getId());
                newItem.setDecisionType(entity);
                decisionRepository.save(newItem);
            }
        }
        return this.getRepository().getReferenceById(entity.getId());
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
