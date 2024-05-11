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

import de.starwit.persistence.entity.AutonomyLevelEntity;
import de.starwit.service.impl.AutonomyLevelService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * AutonomyLevel RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/autonomylevel")
public class AutonomyLevelController {

    static final Logger LOG = LoggerFactory.getLogger(AutonomyLevelController.class);

    @Autowired
    private AutonomyLevelService autonomylevelService;

    @Operation(summary = "Get all autonomylevel")
    @GetMapping
    public List<AutonomyLevelEntity> findAll() {
        return this.autonomylevelService.findAll();
    }


    @Operation(summary = "Get autonomylevel with id")
    @GetMapping(value = "/{id}")
    public AutonomyLevelEntity findById(@PathVariable("id") Long id) {
        return this.autonomylevelService.findById(id);
    }

    @Operation(summary = "Create autonomylevel")
    @PostMapping
    public AutonomyLevelEntity save(@Valid @RequestBody AutonomyLevelEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update autonomylevel")
    @PutMapping
    public AutonomyLevelEntity update(@Valid @RequestBody AutonomyLevelEntity entity) {
        return autonomylevelService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete autonomylevel")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        autonomylevelService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("AutonomyLevel not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.autonomylevel.notfound", "AutonomyLevel not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
