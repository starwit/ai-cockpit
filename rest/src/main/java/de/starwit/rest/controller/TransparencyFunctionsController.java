package de.starwit.rest.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping(path = "${rest.base-path}/transparency")
public class TransparencyFunctionsController {

    static final Logger LOG = LoggerFactory.getLogger(TransparencyFunctionsController.class);

    @Operation(summary = "Get info for module with given id")
    @GetMapping(value = "/{id}")
    public String findById(@PathVariable("id") Long id) {

        return "not implemented yet";
    }

}
