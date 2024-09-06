package de.starwit.rest.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.aicockpit.transparency.model.Module;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping(path = "${rest.base-path}/transparency")
public class TransparencyFunctionsController {

    static final Logger LOG = LoggerFactory.getLogger(TransparencyFunctionsController.class);

    private List<Module> modules = new ArrayList<>();

    @PostConstruct
    private void init() {
        ClassPathResource transparencyResource = new ClassPathResource("transparencytestdata.json");
        try {
            byte[] binaryData = FileCopyUtils.copyToByteArray(transparencyResource.getInputStream());
            String strJson = new String(binaryData, StandardCharsets.UTF_8);
            Module[] modulesArray = new ObjectMapper().readValue(
                    strJson,
                    Module[].class);
            modules = new ArrayList<>(Arrays.asList(modulesArray));
        } catch (IOException e) {
            LOG.error("Can't load static test data for transparency functions " + e.getMessage());
        }
    }

    @Operation(summary = "Get info for module with given id")
    @GetMapping(value = "/modules/{id}")
    public Module findById(@PathVariable("id") Long id) {
        for (Module m : modules) {
            if (m.getId() == id) {
                return m;
            }
        }
        return null;
    }

    @Operation(summary = "Get list of all modules")
    @GetMapping(value = "/modules")
    public List<Module> getModules() {
        return modules;
    }

}
