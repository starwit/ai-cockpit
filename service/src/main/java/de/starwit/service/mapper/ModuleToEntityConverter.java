package de.starwit.service.mapper;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

import de.starwit.aic.model.Module;
import de.starwit.aic.model.ModuleSBOMLocationValue;
import de.starwit.persistence.entity.ModelType;
import de.starwit.persistence.entity.ModuleEntity;

@Component
public class ModuleToEntityConverter extends AbstractConverter<Module, ModuleEntity> {

    @Override
    public ModuleEntity convert(Module module) {
        ModuleEntity entity = new ModuleEntity();
        entity.setDescription(module.getDescription());
        entity.setName(module.getName());
        entity.setApplicationIdentifier(module.getApplicationIdentifier());
        entity.setVersion(module.getVersion());
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
        return entity;
    }

    private Map<String, String> convertMap(Map<String, ModuleSBOMLocationValue> map) {
        Map<String, String> newMap = new HashMap<>();
        for (Map.Entry<String, ModuleSBOMLocationValue> entry : map.entrySet()) {
            newMap.put(entry.getKey(), entry.getValue().getUrl());
        }
        return newMap;
    }

}
