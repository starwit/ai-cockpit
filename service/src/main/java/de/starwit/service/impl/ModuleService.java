package de.starwit.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.aic.model.Module;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.DecisionRepository;
import de.starwit.persistence.repository.ModuleRepository;
import de.starwit.service.mapper.ModuleMapper;
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

    @Autowired
    private DecisionRepository decisionRepository;

    private ModuleMapper mapper = new ModuleMapper();

    @Override
    public ModuleRepository getRepository() {
        return moduleRepository;
    }

    public List<ModuleEntity> findByName(String name) {
        return moduleRepository.findByName(name);
    }

    public List<ModuleEntity> findAllWithDecisionCount() {
        var modules = moduleRepository.findAll();
        for (ModuleEntity moduleEntity : modules) {
            moduleEntity.setOpenDecisions(
                    (int) decisionRepository.countByModuleIdAndState(moduleEntity.getId(), DecisionState.NEW));
            moduleEntity.setMadeDecisions(
                    (int) decisionRepository.countByModuleIdAndState(moduleEntity.getId(), DecisionState.ACCEPTED));
        }
        return modules;
    }

    @Override
    @Transactional
    public ModuleEntity saveOrUpdate(ModuleEntity entity) {
        return moduleRepository.save(entity);
    }

    @Transactional
    public ModuleEntity saveOrUpdate(Module module) {
        var entity = mapper.toEntity(module);
        entity = moduleRepository.save(entity);
        return entity;
    }

    public ModuleEntity findFirstByNameLike(String name) {
        return moduleRepository.findFirstByNameLike(name);
    }
}