package de.starwit.service.impl;

import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import de.starwit.aic.model.DecisionType;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.service.mapper.DecisionTypeMapper;

@Service
public class AicService {

    static final Logger LOG = LoggerFactory.getLogger(AicService.class);

    @Value("${default.module.name:Anomaly Detection}")
    private String defaultModuleName;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private ActionTypeRepository actionTypeRepository;

    private DecisionTypeMapper decisionTypeMapper = new DecisionTypeMapper();

    public void importDecisionTypes(List<DecisionType> dtos) {
        List<DecisionTypeEntity> decisionTypeEntities = decisionTypeMapper.toEntityList(dtos);
        for (DecisionTypeEntity decisionTypeEntity : decisionTypeEntities) {
            Set<ActionTypeEntity> actionTypes = mapActionTypesByName(decisionTypeEntity.getActionType());
            decisionTypeEntity.setActionType(actionTypes);
        }
        processEntitiesWithModule(decisionTypeEntities, moduleService);
        decisionTypeRepository.saveAll(decisionTypeEntities);

    }

    private Set<ActionTypeEntity> mapActionTypesByName(Set<ActionTypeEntity> decisionActionTypes) {
        Set<ActionTypeEntity> actionTypes = new java.util.HashSet<ActionTypeEntity>();
        if (!decisionActionTypes.isEmpty()) {
            for (ActionTypeEntity actionType : decisionActionTypes) {
                List<ActionTypeEntity> foundactionTypes = actionTypeRepository.findByName(actionType.getName());
                if (!foundactionTypes.isEmpty() &&
                        foundactionTypes.get(0).getName().equals(actionType.getName())) {
                    actionTypes.add(foundactionTypes.get(0));
                } else {
                    LOG.error("Could not found actionType with the name " + actionType.getName());
                }
            }
        }
        return actionTypes;
    }

    // Entity muss getModule() und setModule() haben
    public <T> void processEntitiesWithModule(List<T> entities, ModuleService moduleService) {
        for (T entity : entities) {
            try {

                ModuleEntity module = (ModuleEntity) entity.getClass().getMethod("getModule").invoke(entity);

                if (module == null || module.getName() == null) {
                    module = new ModuleEntity();
                    module.setName(defaultModuleName);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                }

                List<ModuleEntity> list = moduleService.findByName(module.getName());
                if (list.isEmpty() || !list.get(0).getName().equals(module.getName())) {
                    module = moduleService.saveOrUpdate(module);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                } else {
                    module = list.get(0);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                }
            } catch (Exception e) {
                throw new RuntimeException("Error processing entity: " + entity, e);
            }
        }
    }

}
