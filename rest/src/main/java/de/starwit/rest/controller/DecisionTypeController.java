package de.starwit.rest.controller;

import java.util.List;

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

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.impl.DecisionTypeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

/**
 * DecisionType RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/decisiontype")
public class DecisionTypeController {

    static final Logger LOG = LoggerFactory.getLogger(DecisionTypeController.class);

    @Autowired
    private DecisionTypeService decisiontypeService;

    @Operation(summary = "Get all decisiontype")
    @GetMapping
    public List<DecisionTypeEntity> findAll() {
        return this.decisiontypeService.findAll();
    }

    @Operation(summary = "Get all decisions for module")
    @GetMapping("/by-module/{id}")
    public List<DecisionTypeEntity> findByModuleId(@PathVariable("id") Long id) {
        return this.decisiontypeService.findByModule(id);
    }

    @Operation(summary = "Get decisiontype with id")
    @GetMapping(value = "/{id}")
    public DecisionTypeEntity findById(@PathVariable("id") Long id) {
        return this.decisiontypeService.findById(id);
    }

    @Operation(summary = "Create decisiontype")
    @PostMapping
    public DecisionTypeEntity save(@Valid @RequestBody DecisionTypeEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update decisiontype")
    @PutMapping
    public DecisionTypeEntity update(@Valid @RequestBody DecisionTypeEntity entity) {
        return decisiontypeService.saveOrUpdate(entity);
    }

    @Operation(summary = "Update a list of Decision Types")
    @PutMapping(value = "/update-list")
    public void updateList(@Valid @RequestBody List<DecisionTypeEntity> entityList) {
        decisiontypeService.saveOrUpdateList(entityList);
    }

    @Operation(summary = "Delete decisiontype")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        decisiontypeService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("DecisionType not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.decisiontype.notfound",
                "DecisionType not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
