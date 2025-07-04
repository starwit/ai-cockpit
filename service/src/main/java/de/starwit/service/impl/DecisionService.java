package de.starwit.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionRepository;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.persistence.repository.ModuleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

/**
 * 
 * Decision Service class
 *
 */
@Service
public class DecisionService implements ServiceInterface<DecisionEntity, DecisionRepository> {

    @Value("${decision.type.default:dangerous driving behaviour}")
    private String defaultDecisionType;

    @Value("${default.module.name:Anomaly Detection}")
    private String anomalyDetectionName;

    @Value("${decision.type.random:false}")
    private Boolean randomDecisionType;

    private final EntityManager entityManager;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private ActionTypeRepository actionTypeRepository;

    @Autowired
    private ActionRepository actionRepository;

    @Override
    public DecisionRepository getRepository() {
        return decisionRepository;
    }

    public List<DecisionEntity> findAllOpenDecisions() {
        return decisionRepository.findByState(DecisionState.NEW);
    }

    public List<DecisionEntity> findAllOpenDecisionsByModule(Long moduleId) {
        return decisionRepository.findByModuleIdAndState(moduleId, DecisionState.NEW);
    }

    public List<DecisionEntity> findByModule(Long moduleId) {
        List<DecisionEntity> result = decisionRepository.findByModuleId(moduleId);
        return result;
    }

    public void saveOrUpdateList(@Valid List<DecisionEntity> entityList) {
        LOG.debug("save or updating list with " + entityList.size() + " items");
        for (DecisionEntity entity : entityList) {
            createDecisionEntitywithAction(entity);
        }
    }

    public DecisionService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    private DecisionTypeEntity processDecisionType(DecisionTypeEntity entity, Long moduleId) {
        DecisionTypeEntity decisionType = null;
        if (entity != null) {
            decisionType = findDecisionTypeByNameOrId(entity.getName(), entity.getId(), moduleId);
        } else if (randomDecisionType) {
            List<DecisionTypeEntity> types = decisionTypeRepository.findByModuleId(moduleId);
            if (types != null) {
                int randomNum = (int) (Math.random() * types.size());
                decisionType = types.get(randomNum);
            }
        } else {
            decisionType = findDecisionTypeByNameOrId(defaultDecisionType, null, moduleId);
        }
        return decisionType;
    }

    private ModuleEntity processModule(ModuleEntity entity) {
        ModuleEntity module = null;
        if (entity != null) {
            module = entity.getId() != null ? moduleRepository.getReferenceById(entity.getId())
                    : moduleRepository.findFirstByNameLike(entity.getName());
        } else {
            module = moduleRepository.findFirstByNameLike(anomalyDetectionName);
        }
        if (module == null) {
            module = moduleRepository.findFirstByNameLike(anomalyDetectionName);
        }
        return module;
    }

    public DecisionEntity createDecisionEntitywithAction(DecisionEntity entity) {
        ModuleEntity module = processModule(entity.getModule());
        DecisionTypeEntity decisionType = processDecisionType(entity.getDecisionType(), module.getId());

        if (decisionType == null) {
            throw new EntityNotFoundException("Decision type not found.");
        } else {
            entity.setDecisionType(decisionType);
            List<ActionTypeEntity> actionTypes = actionTypeRepository
                    .findByDecisionType(decisionType.getId());
            addActions(entity, actionTypes);
        }

        entity.setModule(module);
        entity = saveOrUpdate(entity);
        entityManager.detach(entity);
        return entity;
    }

    public DecisionEntity UpdateDecisionEntityWithAction(DecisionEntity toBeSaved, Set<Long> addedActionTypeIds,
            Set<Long> removedActionTypeIds) {
        DecisionEntity persisted = decisionRepository.findById(toBeSaved.getId()).get();
        persisted.setDecisionType(toBeSaved.getDecisionType());
        persisted.setDescription(toBeSaved.getDescription());
        persisted.setState(toBeSaved.getState());

        List<ActionTypeEntity> actionTypes = new ArrayList<>();
        for (Long id : addedActionTypeIds) {
            actionTypeRepository.findById(id).ifPresent(actionType -> actionTypes.add(actionType));
        }
        addActions(persisted, actionTypes);
        removeActions(persisted, removedActionTypeIds);
        persisted = saveOrUpdate(persisted);
        return persisted;
    }

    private void removeActions(DecisionEntity entity, Set<Long> removedActionTypeIds) {
        Set<ActionEntity> actions = entity.getAction();
        List<ActionEntity> removeActions = new ArrayList<>();
        if (actions == null) {
            return;
        }
        for (ActionEntity action : actions) {
            if (removedActionTypeIds.contains(action.getActionType().getId())
                    && (action.getState() == ActionState.NEW
                            || action.getState() == ActionState.CANCELED)) {
                removeActions.add(action);
            }
        }

        for (ActionEntity action : removeActions) {
            entity.removeFromAction(action);
            actionTypeRepository.findById(action.getId())
                    .ifPresent(actionType -> actionRepository.deleteById(action.getId()));
        }
    }

    private void addActions(DecisionEntity entity, List<ActionTypeEntity> actionTypes) {
        if (actionTypes != null && !actionTypes.isEmpty()) {
            for (ActionTypeEntity actionType : actionTypes) {
                ActionEntity action = new ActionEntity();
                action.setCreationTime(entity.getAcquisitionTime());
                action.setActionType(actionType);
                if (entity.getId() != null) {
                    actionRepository.save(action);
                }
                entity.addToAction(action);
            }
        }
    }

    public DecisionTypeEntity findDecisionTypeByNameOrId(String name, Long decisionTypeId, Long moduleId) {
        DecisionTypeEntity decisionType = null;
        if (decisionTypeId != null) {
            decisionType = decisionTypeRepository.findById(decisionTypeId).orElse(null);
        } else {
            decisionType = decisionTypeRepository.findFirstByNameLikeAndModuleId(name, moduleId);
        }
        return decisionType;
    }
}
