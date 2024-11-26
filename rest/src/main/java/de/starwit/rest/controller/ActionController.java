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

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.service.impl.ActionService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * Action RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/action")
public class ActionController {

    static final Logger LOG = LoggerFactory.getLogger(ActionController.class);

    @Autowired
    private ActionService actionService;

    @Operation(summary = "Get all action")
    @GetMapping
    public List<ActionEntity> findAll() {
        return this.actionService.findAll();
    }

    @Operation(summary = "Get all action without decision")
    @GetMapping(value = "/find-without-decision")
    public List<ActionEntity> findAllWithoutDecision() {
        return actionService.findAllWithoutDecision();
    }

    @Operation(summary = "Get action with id")
    @GetMapping(value = "/{id}")
    public ActionEntity findById(@PathVariable("id") Long id) {
        return this.actionService.findById(id);
    }

    @Operation(summary = "Create action")
    @PostMapping
    public ActionEntity save(@Valid @RequestBody ActionEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update action")
    @PutMapping
    public ActionEntity update(@Valid @RequestBody ActionEntity entity) {
        return actionService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete action")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        actionService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Action not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.action.notfound", "Action not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
