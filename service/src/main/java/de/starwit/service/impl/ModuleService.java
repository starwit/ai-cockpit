package de.starwit.service.impl;

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

}