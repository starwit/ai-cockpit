package de.starwit.rest.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.aicockpit.transparency.model.ModelType;
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
        Module m = new Module();
        m.setId(1L);
        m.setName("AnDe");
        m.setDescription("A fantastic AI module");
        m.setUseAI(true);
        m.setAiType(ModelType.MISC);
        m.setModelVersion("1.0.0");
        HashMap<String, String> sbomURLs = new HashMap<>();
        sbomURLs.put("backend", "sbom-backend.json");
        sbomURLs.put("frontend", "sbom-frontend.json");
        m.setsBOMLocation(sbomURLs);
        modules.add(m);

        Module m1 = new Module();
        m1.setId(2L);
        m1.setName("AI Cockpit");
        m1.setDescription("An AI act inspired cockpit to monitor AI apps");
        m1.setUseAI(false);
        HashMap<String, String> sbomURLs2 = new HashMap<>();
        sbomURLs2.put("backend", "sbom-backend.json");
        sbomURLs2.put("frontend", "sbom-frontend.json");
        m1.setsBOMLocation(sbomURLs2);
        modules.add(m1);

        Module m2 = new Module();
        m2.setId(3L);
        m2.setName("Sandy");
        m2.setDescription("A super intepretation engine");
        m2.setUseAI(true);
        m2.setAiType(ModelType.MISC);
        m2.setModelVersion("1.0.0");
        HashMap<String, String> sbomURLs3 = new HashMap<>();
        sbomURLs3.put("backend", "sbom-backend.json");
        sbomURLs3.put("frontend", "sbom-frontend.json");
        m2.setsBOMLocation(sbomURLs3);
        modules.add(m2);
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
