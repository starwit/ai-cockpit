package de.starwit.rest.controller;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.aic.model.ActionType;
import de.starwit.aic.model.Decision;
import de.starwit.aic.model.DecisionType;
import de.starwit.aic.model.Module;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.service.impl.ActionTypeService;
import de.starwit.service.impl.AicService;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.impl.DecisionTypeService;
import de.starwit.service.impl.ModuleService;
import de.starwit.service.mapper.ActionTypeMapper;
import de.starwit.service.mapper.DecisionMapper;
import de.starwit.service.mapper.DecisionTypeMapper;
import de.starwit.service.mapper.ModuleMapper;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "${rest.base-path}/aic")
public class AicContoller {

    static final Logger LOG = LoggerFactory.getLogger(TransparencyFunctionsController.class);

    @Autowired
    ModuleService moduleService;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    private DecisionService decisionService;

    @Autowired
    private DecisionTypeService decisionTypeService;

    @Autowired
    private ActionTypeService actionTypeService;

    @Autowired
    private AicService aicService;

    DecisionMapper decisionMapper = new DecisionMapper();

    ModuleMapper moduleMapper = new ModuleMapper();

    DecisionTypeMapper decisionTypeMapper = new DecisionTypeMapper();

    ActionTypeMapper actionTypeMapper = new ActionTypeMapper();

    @Operation(summary = "Get list of all modules")
    @GetMapping(value = "/modules")
    public List<Module> getModules() {
        List<Module> result = new LinkedList<>();
        var entities = moduleService.findAll();
        LOG.info("Found " + entities.size() + " modules");
        for (ModuleEntity entity : entities) {
            result.add(moduleMapper.toDto(entity));
        }
        return result;
    }

    @Operation(summary = "Create list of modules")
    @PostMapping(value = "/modules/update-list")
    public void createModuleList(@RequestBody List<Module> dtos) {
        List<ModuleEntity> entities = moduleMapper.toEntityList(dtos);
        LOG.debug("save or updating list with " + entities.size() + " items");
        for (ModuleEntity entity : entities) {
            moduleService.saveOrUpdate(entity);
        }
    }

    @Operation(summary = "Create new module")
    @PostMapping(value = "/modules")
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        LOG.info("Trying to create new module " + module.getName());
        var entity = moduleService.saveOrUpdate(module);
        var responseModule = moduleMapper.toDto(entity);
        return new ResponseEntity<>(responseModule, HttpStatus.OK);
    }

    @Operation(summary = "Find module by name")
    @GetMapping(value = "/modules/byname/{name}")
    public ResponseEntity<Module> findByName(@PathVariable("name") String name) throws NotificationException {
        List<ModuleEntity> modules = moduleService.findByName(name);
        if (modules.size() == 1) {
            return new ResponseEntity<>(moduleMapper.toDto(modules.get(0)), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Create decision")
    @PostMapping("decision")
    public DecisionEntity save(@Valid @RequestBody Decision dto) {
        DecisionEntity entity = decisionMapper.toEntity(dto);
        return decisionService.createDecisionEntitywithAction(entity);
    }

    @Operation(summary = "Create a list of decisions")
    @PostMapping("decision/update-list")
    public void save(@Valid @RequestBody List<Decision> dtos) {
        List<DecisionEntity> entities = decisionMapper.toEntityList(dtos);
        decisionService.saveOrUpdateList(entities);
    }

    @Operation(summary = "Update a list of action types")
    @PostMapping(value = "/action-type/update-list")
    public void updateActionTypeList(@Valid @RequestBody List<ActionType> dtos) {
        List<ActionTypeEntity> entities = actionTypeMapper.toEntityList(dtos);
        aicService.processEntitiesWithModule(entities, moduleService);
        actionTypeService.saveOrUpdateList(entities);
    }

    @Operation(summary = "Update a list of decision types")
    @PostMapping(value = "/decision-type/update-list")
    public void updateDecisionTypeList(@Valid @RequestBody List<DecisionType> dtos) {
        aicService.importDecisionTypes(dtos);
    }

}
