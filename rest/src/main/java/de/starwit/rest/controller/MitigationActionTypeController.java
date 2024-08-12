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

import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.service.impl.MitigationActionTypeService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * MitigationActionType RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/mitigationactiontype")
public class MitigationActionTypeController {

    static final Logger LOG = LoggerFactory.getLogger(MitigationActionTypeController.class);

    @Autowired
    private MitigationActionTypeService mitigationactiontypeService;

    @Operation(summary = "Get all mitigationactiontype")
    @GetMapping
    public List<MitigationActionTypeEntity> findAll() {
        return this.mitigationactiontypeService.findAll();
    }

    @Operation(summary = "Get mitigationactiontype with id")
    @GetMapping(value = "/{id}")
    public MitigationActionTypeEntity findById(@PathVariable("id") Long id) {
        return this.mitigationactiontypeService.findById(id);
    }

    @Operation(summary = "Get mitigationactiontype by incident type")
    @GetMapping(value = "/by-incident-type/{id}")
    public List<MitigationActionTypeEntity> findByTrafficIncidentType(@PathVariable("id") Long trafficIncidentId) {
        List<MitigationActionTypeEntity> result = this.mitigationactiontypeService
                .findByTrafficIncidentType(trafficIncidentId);
        return result;
    }

    @Operation(summary = "Create mitigationactiontype")
    @PostMapping
    public MitigationActionTypeEntity save(@Valid @RequestBody MitigationActionTypeEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update mitigationactiontype")
    @PutMapping
    public MitigationActionTypeEntity update(@Valid @RequestBody MitigationActionTypeEntity entity) {
        return mitigationactiontypeService.saveOrUpdate(entity);
    }

    @Operation(summary = "Update a list of mitigationactiontype")
    @PutMapping(value = "/updateList")
    public void updateList(@Valid @RequestBody List<MitigationActionTypeEntity> entityList) {
        mitigationactiontypeService.saveOrUpdateList(entityList);
    }

    @Operation(summary = "Delete mitigationactiontype")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        mitigationactiontypeService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("MitigationActionType not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.mitigationactiontype.notfound",
                "MitigationActionType not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
