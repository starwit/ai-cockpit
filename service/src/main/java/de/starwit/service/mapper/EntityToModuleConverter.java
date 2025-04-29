package de.starwit.service.mapper;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.modelmapper.AbstractConverter;

import de.starwit.aic.model.AIModel;
import de.starwit.aic.model.AIModelType;
import de.starwit.aic.model.Module;
import de.starwit.aic.model.ModuleSBOMLocationValue;
import de.starwit.persistence.entity.ModuleEntity;

public class EntityToModuleConverter extends AbstractConverter<ModuleEntity, Module> {

    @Override
    protected Module convert(ModuleEntity entity) {
        Module module = new Module();
        module.setId(entity.getId());
        module.setDescription(entity.getDescription());
        module.setApplicationIdentifier(entity.getApplicationIdentifier());
        module.setVersion(entity.getVersion());
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

    private Map<String, ModuleSBOMLocationValue> convertToModuleMap(Map<String, String> map) {
        Map<String, ModuleSBOMLocationValue> newMap = new HashMap<>();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            var location = new ModuleSBOMLocationValue();
            location.setUrl(entry.getValue());
            newMap.put(entry.getKey(), location);
        }
        return newMap;
    }

}
