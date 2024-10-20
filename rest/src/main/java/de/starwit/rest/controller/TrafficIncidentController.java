package de.starwit.rest.controller;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import java.security.InvalidKeyException;
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
import java.io.IOException;

import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.service.impl.MinioException;
import de.starwit.service.impl.TrafficIncidentService;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;

/**
 * TrafficIncident RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/trafficincident")
public class TrafficIncidentController {

    static final Logger LOG = LoggerFactory.getLogger(TrafficIncidentController.class);

    @Autowired
    private TrafficIncidentService trafficincidentService;

    @Operation(summary = "Get all trafficincident")
    @GetMapping
    public List<TrafficIncidentEntity> findAll() {
        return this.trafficincidentService.findAll();
    }

    @Operation(summary = "Get all trafficincident without trafficIncidentType")
    @GetMapping(value = "/find-without-trafficIncidentType")
    public List<TrafficIncidentEntity> findAllWithoutTrafficIncidentType() {
        return trafficincidentService.findAllWithoutTrafficIncidentType();
    }

    @Operation(summary = "Get all trafficincident without other trafficIncidentType")
    @GetMapping(value = "/find-without-other-trafficIncidentType/{id}")
    public List<TrafficIncidentEntity> findAllWithoutOtherTrafficIncidentType(@PathVariable("id") Long id) {
        return trafficincidentService.findAllWithoutOtherTrafficIncidentType(id);
    }

    @Operation(summary = "Get trafficincident with id")
    @GetMapping(value = "/{id}")
    public TrafficIncidentEntity findById(@PathVariable("id") Long id) {
        return this.trafficincidentService.findById(id);
    }

    @Operation(summary = "Create trafficincident")
    @PostMapping
    public TrafficIncidentEntity save(@Valid @RequestBody TrafficIncidentEntity entity) {
        return trafficincidentService.addMitigationActionsToIncidentEntity(entity);
    }

    @Operation(summary = "Update trafficincident")
    @PutMapping
    public TrafficIncidentEntity update(@Valid @RequestBody TrafficIncidentEntity entity) {
        return trafficincidentService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete trafficincident")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        trafficincidentService.delete(id);
    }

    @GetMapping("/download/{bucketName}/{objectName}")
    public ResponseEntity<byte[]> download(@PathVariable("bucketName") String bucketName,
            @PathVariable("objectName") String objectName) throws InvalidKeyException, IOException, MinioException{
        byte[] file = trafficincidentService.getFileFromMinio(bucketName, objectName);
        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + objectName);
        return ResponseEntity.ok()
                .headers(header)
                .contentLength(Long.valueOf(file.length))
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("TrafficIncident not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.trafficincident.notfound", "TrafficIncident not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
