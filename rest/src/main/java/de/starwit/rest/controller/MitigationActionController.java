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

import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.service.impl.MitigationActionService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * MitigationAction RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/mitigationaction")
public class MitigationActionController {

    static final Logger LOG = LoggerFactory.getLogger(MitigationActionController.class);

    @Autowired
    private MitigationActionService mitigationactionService;

    @Operation(summary = "Get all mitigationaction")
    @GetMapping
    public List<MitigationActionEntity> findAll() {
        return this.mitigationactionService.findAll();
    }

    @Operation(summary = "Get all mitigationaction without decision")
    @GetMapping(value = "/find-without-decision")
    public List<MitigationActionEntity> findAllWithoutDecision() {
        return mitigationactionService.findAllWithoutDecision();
    }

    @Operation(summary = "Get all mitigationaction without other decision")
    @GetMapping(value = "/find-without-other-decision/{id}")
    public List<MitigationActionEntity> findAllWithoutOtherDecision(@PathVariable("id") Long id) {
        return mitigationactionService.findAllWithoutOtherDecision(id);
    }

    @Operation(summary = "Get all mitigationaction without mitigationActionType")
    @GetMapping(value = "/find-without-mitigationActionType")
    public List<MitigationActionEntity> findAllWithoutMitigationActionType() {
        return mitigationactionService.findAllWithoutMitigationActionType();
    }

    @Operation(summary = "Get all mitigationaction without other mitigationActionType")
    @GetMapping(value = "/find-without-other-mitigationActionType/{id}")
    public List<MitigationActionEntity> findAllWithoutOtherMitigationActionType(@PathVariable("id") Long id) {
        return mitigationactionService.findAllWithoutOtherMitigationActionType(id);
    }

    @Operation(summary = "Get mitigationaction with id")
    @GetMapping(value = "/{id}")
    public MitigationActionEntity findById(@PathVariable("id") Long id) {
        return this.mitigationactionService.findById(id);
    }

    @Operation(summary = "Create mitigationaction")
    @PostMapping
    public MitigationActionEntity save(@Valid @RequestBody MitigationActionEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update mitigationaction")
    @PutMapping
    public MitigationActionEntity update(@Valid @RequestBody MitigationActionEntity entity) {
        return mitigationactionService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete mitigationaction")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        mitigationactionService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("MitigationAction not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.mitigationaction.notfound", "MitigationAction not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
