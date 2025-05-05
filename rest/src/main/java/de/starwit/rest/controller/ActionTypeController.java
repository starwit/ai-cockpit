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

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.impl.ActionTypeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

/**
 * ActionType RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/actiontype")
public class ActionTypeController {

    static final Logger LOG = LoggerFactory.getLogger(ActionTypeController.class);

    @Autowired
    private ActionTypeService actiontypeService;

    @Operation(summary = "Get all actiontype")
    @GetMapping
    public List<ActionTypeEntity> findAll() {
        return this.actiontypeService.findAll();
    }

    @Operation(summary = "Get all decisions for module")
    @GetMapping("/by-module/{id}")
    public List<ActionTypeEntity> findByModuleId(@PathVariable("id") Long id) {
        return this.actiontypeService.findByModule(id);
    }

    @Operation(summary = "Get actiontype with id")
    @GetMapping(value = "/{id}")
    public ActionTypeEntity findById(@PathVariable("id") Long id) {
        return this.actiontypeService.findById(id);
    }

    @Operation(summary = "Get actiontype by decision type")
    @GetMapping(value = "/by-decision-type/{id}")
    public List<ActionTypeEntity> findByDecisionType(@PathVariable("id") Long decisionId) {
        List<ActionTypeEntity> result = this.actiontypeService
                .findByDecisionType(decisionId);
        return result;
    }

    @Operation(summary = "Create actiontype")
    @PostMapping
    public ActionTypeEntity save(@Valid @RequestBody ActionTypeEntity entity) throws NotificationException {
        return update(entity);
    }

    @Operation(summary = "Update actiontype")
    @PutMapping
    public ActionTypeEntity update(@Valid @RequestBody ActionTypeEntity entity) throws NotificationException {
        if (entity == null) {
            throw new NotificationException("error.decisiontype.empty", "DecisionType is null.");
        }
        if (entity.getModule() == null || entity.getModule().getId() == null) {
            throw new NotificationException("error.module.empty", "Module ID for decisionType not set.");
        }
        return actiontypeService.saveOrUpdate(entity);
    }

    @Operation(summary = "Update a list of actiontype")
    @PutMapping(value = "/update-list")
    public void updateList(@Valid @RequestBody List<ActionTypeEntity> entityList) throws NotificationException {
        LOG.debug("save or updating list with " + entityList.size() + " items");
        for (ActionTypeEntity actionTypeEntity : entityList) {
            update(actionTypeEntity);
        }
    }

    @Operation(summary = "Delete actiontype")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        actiontypeService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("ActionType not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.actiontype.notfound",
                "ActionType not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
