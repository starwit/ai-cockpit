package de.starwit.rest.controller;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.dto.DecisionWithActionTypesDto;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.impl.MinioException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

/**
 * Decision RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/decision")
public class DecisionController {

    static final Logger LOG = LoggerFactory.getLogger(DecisionController.class);

    @Autowired
    private DecisionService decisionService;

    @Operation(summary = "Get all decision")
    @GetMapping
    public List<DecisionEntity> findAll() {
        return this.decisionService.findAllByModule(1L);
    }

    @Operation(summary = "Get all open decisions")
    @GetMapping("/open")
    public List<DecisionEntity> findAllOpen() {
        return this.decisionService.findAllOpenDecisions();
    }

    @Operation(summary = "Get decision with id")
    @GetMapping(value = "/{id}")
    public DecisionEntity findById(@PathVariable("id") Long id) {
        return this.decisionService.findById(id);
    }

    @Operation(summary = "Create decision")
    @PostMapping
    public DecisionEntity save(@Valid @RequestBody DecisionEntity entity) {
        return decisionService.createDecisionEntitywithAction(entity);
    }

    @Operation(summary = "Update decision")
    @PutMapping
    public DecisionEntity update(@Valid @RequestBody DecisionEntity entity) {
        LOG.info("Updating decision with id: {}", entity.getId());
        return decisionService.saveOrUpdate(entity);
    }

    @Operation(summary = "Update decision with action types")
    @PutMapping("/update-with-actions")
    public void updateDecisionsWithActions(@RequestBody DecisionWithActionTypesDto dto) {
        LOG.info("Updating decision with id: {}", dto.getDecision().getId());

        Set<ActionEntity> oldActions = dto.getDecision().getAction();

        Set<Long> newActionTypeIds = dto.getActionTypeIds();
        Set<Long> oldActionTypeIds = new HashSet<>();
        Set<Long> unchangedActionTypeIds = new HashSet<>();

        if (newActionTypeIds != null && oldActions != null) {
            for (ActionEntity entity : oldActions) {
                oldActionTypeIds.add(entity.getActionType().getId());
            }

            for (Long id : oldActionTypeIds) {
                if (newActionTypeIds.contains(id)) {
                    unchangedActionTypeIds.add(id);
                }
            }
            newActionTypeIds.removeAll(unchangedActionTypeIds);
            oldActionTypeIds.removeAll(unchangedActionTypeIds);

        }
        decisionService.UpdateDecisionEntityWithAction(dto.getDecision(), newActionTypeIds, oldActionTypeIds);
    }

    @Operation(summary = "Delete decision")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        decisionService.delete(id);
    }

    @GetMapping("/download/{bucketName}/{*objectName}")
    public ResponseEntity<byte[]> download(@PathVariable("bucketName") String bucketName,
            @PathVariable("objectName") String objectName) throws InvalidKeyException, IOException, MinioException {
            
        // Remove the leading slash from objectName (PathPattern with * always adds a leading slash)
        String objectNameWithoutPrefix = objectName.substring(1);
        
        byte[] file = decisionService.getFileFromMinio(bucketName, objectNameWithoutPrefix);
        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + objectNameWithoutPrefix);
        return ResponseEntity.ok()
                .headers(header)
                .contentLength(Long.valueOf(file.length))
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Decision not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.decision.notfound", "Decision not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
