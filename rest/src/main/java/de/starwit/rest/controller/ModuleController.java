package de.starwit.rest.controller;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.service.impl.ModuleService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * Module RestController
 */
@RestController
@RequestMapping(path = "${rest.base-path}/module")
public class ModuleController {

    static final Logger LOG = LoggerFactory.getLogger(ModuleController.class);

    @Autowired
    private ModuleService moduleService;

    @Operation(summary = "Get all module")
    @GetMapping
    public List<ModuleEntity> findAll() {
        return this.moduleService.findAll();
    }

    @Operation(summary = "Get module with id")
    @GetMapping(value = "/{id}")
    public ModuleEntity findById(@PathVariable("id") Long id) {
        return this.moduleService.findById(id);
    }

    @Operation(summary = "Get module by name")
    @GetMapping(value = "/byname/{name}")
    public ModuleEntity findByName(@PathVariable("name") String name) {
        var entityList = this.moduleService.findByName(name);
        if (entityList != null && !entityList.isEmpty()) {
            return this.moduleService.findByName(name).getFirst();
        } else {
            throw new EntityNotFoundException("Module not found");
        }
    }

    @Operation(summary = "Create module")
    @PostMapping
    public ModuleEntity save(@Valid @RequestBody ModuleEntity entity) {
        LOG.info("Create module " + entity.getName());
        return update(entity);
    }

    @Operation(summary = "Update module")
    @PutMapping
    public ModuleEntity update(@Valid @RequestBody ModuleEntity entity) {
        return moduleService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete module")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        moduleService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Module not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.module.notfound", "Module not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
