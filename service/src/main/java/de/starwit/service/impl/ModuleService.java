package de.starwit.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ModuleRepository;
import jakarta.transaction.Transactional;
import de.starwit.aic.model.Module;
import de.starwit.aic.model.ModuleSBOMLocationValue;
import de.starwit.persistence.entity.ModelType;
import java.util.Map;
import java.util.HashMap;

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
        ModuleEntity entityToSave = new ModuleEntity();
        entityToSave.setDescription(module.getDescription());
        entityToSave.setName(module.getName());
        entityToSave.setUseAI(module.getUseAI());
        entityToSave.setModelName(module.getModel().getName());
        entityToSave.setModelVersion(module.getModel().getVersion());
        ModelType modelType = ModelType.fromValue(module.getModel().getModelType().toString());
        entityToSave.setModelType(modelType);
        entityToSave.setModelLink(module.getModel().getModelLink().toString());
        entityToSave.setPublicTrainingData(module.getModel().getPublicTrainingData());
        if (module.getModel().getPublicTrainingData()) {
            entityToSave.setLinkToPublicTrainingData(module.getModel().getLinkToPublicTrainingData().toString());
        }
        entityToSave.setSbomlocations(convertMap(module.getsBOMLocation()));
        return moduleRepository.save(entityToSave);
    }

    private Map<String, String> convertMap(Map<String, ModuleSBOMLocationValue> map) {
        Map<String, String> newMap = new HashMap<>();
        for (Map.Entry<String, ModuleSBOMLocationValue> entry : map.entrySet()) {
            newMap.put(entry.getKey(), entry.getValue().getUrl());
        }
        return newMap;
    }
}