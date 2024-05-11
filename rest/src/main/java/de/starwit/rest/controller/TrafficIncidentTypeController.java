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

import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.service.impl.TrafficIncidentTypeService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * TrafficIncidentType RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/trafficincidenttype")
public class TrafficIncidentTypeController {

    static final Logger LOG = LoggerFactory.getLogger(TrafficIncidentTypeController.class);

    @Autowired
    private TrafficIncidentTypeService trafficincidenttypeService;

    @Operation(summary = "Get all trafficincidenttype")
    @GetMapping
    public List<TrafficIncidentTypeEntity> findAll() {
        return this.trafficincidenttypeService.findAll();
    }


    @Operation(summary = "Get trafficincidenttype with id")
    @GetMapping(value = "/{id}")
    public TrafficIncidentTypeEntity findById(@PathVariable("id") Long id) {
        return this.trafficincidenttypeService.findById(id);
    }

    @Operation(summary = "Create trafficincidenttype")
    @PostMapping
    public TrafficIncidentTypeEntity save(@Valid @RequestBody TrafficIncidentTypeEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update trafficincidenttype")
    @PutMapping
    public TrafficIncidentTypeEntity update(@Valid @RequestBody TrafficIncidentTypeEntity entity) {
        return trafficincidenttypeService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete trafficincidenttype")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        trafficincidenttypeService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("TrafficIncidentType not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.trafficincidenttype.notfound", "TrafficIncidentType not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
