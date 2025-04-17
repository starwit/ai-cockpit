package de.starwit.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ModuleRepository;
import jakarta.transaction.Transactional;

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
}