package de.starwit.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.service.Automation;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "${rest.base-path}/automation")
public class AutomationController {

    @Autowired
    private Automation automation;

    @Operation(summary = "Get system-wide level of automation")
    @GetMapping()
    public ExecutionPolicy getExecutionPolicy() {
        return automation.getExecutionPolicy();
    }

    @Operation(summary = "Update system-wide level of automation")
    @PutMapping("/{policy}")
    public ExecutionPolicy setExecutionPolicy(@Valid @PathVariable ExecutionPolicy policy) {
        automation.setExecutionPolicy(policy);
        return automation.getExecutionPolicy();
    }
}
