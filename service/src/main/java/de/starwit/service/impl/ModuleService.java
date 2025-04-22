package de.starwit.service.impl;

import java.util.List;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ModuleRepository;
import jakarta.transaction.Transactional;
import de.starwit.aic.model.AIModel;
import de.starwit.aic.model.AIModelType;
import de.starwit.aic.model.Module;
import de.starwit.aic.model.ModuleSBOMLocationValue;
import de.starwit.persistence.entity.ModelType;
import java.util.Map;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.HashSet;

/**
 * 
 * Action Service class
 *
 */
@Service
public class ModuleService implements ServiceInterface<ModuleEntity, ModuleRepository> {

    static final Logger LOG = LoggerFactory.getLogger(ModuleService.class);

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public ModuleRepository getRepository() {
        return moduleRepository;
    }

    public List<ModuleEntity> findByName(String name) {
        return moduleRepository.findByName(name);
    }

    @Override
    @Transactional
    public ModuleEntity saveOrUpdate(ModuleEntity entity) {
        return moduleRepository.save(entity);
    }

    @Transactional
    public ModuleEntity saveOrUpdate(Module module) {
        var entity = convertToModuleEntity(module);
        entity = moduleRepository.save(entity);
        return entity;
    }

    public ModuleEntity convertToModuleEntity(Module module) {
        ModuleEntity entity = new ModuleEntity();
        entity.setDescription(module.getDescription());
        entity.setName(module.getName());
        entity.setUseAI(module.getUseAI());
        entity.setModelName(module.getModel().getName());
        entity.setModelVersion(module.getModel().getVersion());
        entity.setLastDeployment(ZonedDateTime.parse(module.getModel().getLastDeployment().toString()));
        ModelType modelType = ModelType.fromValue(module.getModel().getModelType().toString());
        entity.setModelType(modelType);
        entity.setModelLink(module.getModel().getModelLink().toString());
        entity.setPublicTrainingData(module.getModel().getPublicTrainingData());
        if (module.getModel().getPublicTrainingData()) {
            entity.setLinkToPublicTrainingData(module.getModel().getLinkToPublicTrainingData().toString());
        }
        entity.setSbomlocations(convertMap(module.getsBOMLocation()));
        var successors = module.getSuccessors();
        if (successors != null && !successors.isEmpty()) {
            entity.setSuccessors(new HashSet<>());
            for (Module successor : successors) {
                ModuleEntity successorEntity = moduleRepository.findByName(successor.getName()).getFirst();
                if (successorEntity != null) {
                    entity.getSuccessors().add(successorEntity);
                }
            }
        }

        return entity;
    }

    public Module convertToModule(ModuleEntity entity) {
        Module module = new Module();
        module.setId(entity.getId());
        module.setDescription(entity.getDescription());
        module.setName(entity.getName());
        module.setUseAI(entity.isUseAI());
        module.setModel(new AIModel());
        module.getModel().setName(entity.getModelName());
        module.getModel().setVersion(entity.getModelVersion());
        if (entity.getLastDeployment() != null) {
            module.getModel().setLastDeployment(entity.getLastDeployment().toOffsetDateTime());
        }
        if (entity.getModelType() != null) {
            module.getModel().setModelType(AIModelType.valueOf(entity.getModelType().toString()));
        }
        try {
            module.getModel().setModelLink(new URI(entity.getModelLink()));
        } catch (URISyntaxException | NullPointerException e) {
            module.getModel().setModelLink(null);
        }
        module.getModel().setPublicTrainingData(entity.isPublicTrainingData());
        if (entity.isPublicTrainingData()) {
            try {
                module.getModel().setLinkToPublicTrainingData(new URI(entity.getLinkToPublicTrainingData()));
            } catch (URISyntaxException e) {
                module.getModel().setLinkToPublicTrainingData(null);
            }
        }
        module.setsBOMLocation(convertToModuleMap(entity.getSbomlocations()));
        if (entity.getSuccessors() == null) {
            module.setSuccessors(new HashSet<>());
        } else {
            module.setSuccessors(new HashSet<>());
            for (ModuleEntity successor : entity.getSuccessors()) {
                Module successorModule = new Module();
                successorModule.setId(successor.getId());
                module.getSuccessors().add(successorModule);
            }
        }
        return module;
    }

    public ModuleEntity findModuleByNameOrId(String name, Long moduleId) {
        ModuleEntity module = null;
        if (moduleId != null) {
            module = moduleRepository.findById(moduleId).orElse(null);
        } else {
            module = moduleRepository.findFirstByNameLike(name);
        }
        return module;
    }

    private Map<String, String> convertMap(Map<String, ModuleSBOMLocationValue> map) {
        Map<String, String> newMap = new HashMap<>();
        for (Map.Entry<String, ModuleSBOMLocationValue> entry : map.entrySet()) {
            LOG.info("Key: " + entry.getKey() + " Value: " + entry.getValue().getUrl());
            newMap.put(entry.getKey(), entry.getValue().getUrl());
        }
        return newMap;
    }

    private Map<String, ModuleSBOMLocationValue> convertToModuleMap(Map<String, String> map) {
        Map<String, ModuleSBOMLocationValue> newMap = new HashMap<>();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            var location = new ModuleSBOMLocationValue();
            location.setUrl(entry.getValue());
            newMap.put(entry.getKey(), location);
        }
        return newMap;
    }

    public ModuleEntity findFirstByNameLike(String name) {
        return moduleRepository.findFirstByNameLike(name);
    }
}