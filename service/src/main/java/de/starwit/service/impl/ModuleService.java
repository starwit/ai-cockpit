package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ModuleRepository;

/**
 * 
 * Action Service class
 *
 */
@Service
public class ModuleService implements ServiceInterface<ModuleEntity, ModuleRepository> {

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public ModuleRepository getRepository() {
        return moduleRepository;
    }

    public List<ModuleEntity> findByName(String name) {
        return moduleRepository.findByName(name);
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

    public ModuleEntity findFirstByNameLike(String name) {
        return moduleRepository.findFirstByNameLike(name);
    }
}