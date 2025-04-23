package de.starwit.rest.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.aic.model.Module;
import de.starwit.aic.model.ModuleSBOMLocationValue;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.service.impl.ModuleService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "${rest.base-path}/transparency")
public class TransparencyFunctionsController {

  static final Logger LOG = LoggerFactory.getLogger(TransparencyFunctionsController.class);

  @Autowired
  ModuleService moduleService;

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  ObjectMapper objectMapper;

  @Value("${sbom.enabled:false}")
  private boolean reportGenerationEnabled;

  @Value("${sbom.generator.uri:}")
  private String reportGeneratorUri;

  @Operation(summary = "Get list of all modules")
  @GetMapping(value = "/modules")
  public List<Module> getModules() {
    List<Module> result = new LinkedList<>();
    var entities = moduleService.findAll();
    LOG.info("Found " + entities.size() + " modules");
    for (ModuleEntity entity : entities) {
      result.add(moduleService.convertToModule(entity));
    }
    return result;
  }

  @Operation(summary = "Create new module")
  @PostMapping(value = "/modules")
  public ResponseEntity<Module> createModule(@RequestBody Module module) {
    LOG.info("Trying to create new module " + module.getName());
    var entity = moduleService.saveOrUpdate(module);
    var responseModule = moduleService.convertToModule(entity);
    return new ResponseEntity<>(responseModule, HttpStatus.OK);
  }

  @Operation(summary = "Find module by name")
  @GetMapping(value = "/modules/byname/{name}")
  public ResponseEntity<Module> findByName(@PathVariable("name") String name) throws NotificationException {
    List<ModuleEntity> modules = moduleService.findByName(name);
    if (modules.size() == 1) {
      return new ResponseEntity<>(moduleService.convertToModule(modules.get(0)), HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @Operation(summary = "true if report generation is enabled")
  @GetMapping(value = "/reports/enabled")
  public boolean isEnabled() {
    return reportGenerationEnabled;
  }

  @Operation(summary = "Load sbom from url provided by module")
  @GetMapping(value = "/modules/sbom/{id}/{component}")
  public String loadSBomFromRemoteUri(@PathVariable("id") int id, @PathVariable("component") String component) {
    ModuleEntity entity = moduleService.findById((long) id);
    String sbomUri = null;
    var sboms = entity.getSbomlocations();
    for (String key : sboms.keySet()) {
      if (key.equals(component)) {
        sbomUri = sboms.get(key);
        break;
      }
    }

    if (sbomUri != null) {
      try {
        ResponseEntity<String> response = restTemplate.getForEntity(sbomUri, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
          return response.getBody();
        } else {
          return "";
        }
      } catch (Exception e) {
        LOG.error("Can't load sbom from remote URI " + e.getMessage());
      }
    }

    return "";
  }

  @Operation(summary = "Get PDF report")
  @GetMapping(value = "/reports/{id}/{type}")
  public byte[] loadPDF(HttpServletResponse resp, @PathVariable("id") int id, @PathVariable("type") String type) {
    byte[] result = null;

    var entity = moduleService.findById((long) id);
    if (!reportGenerationEnabled || entity != null) {
      LOG.error("Report generation API called, but generation service is disabled - frontend bug.");
      prepareResponse(resp, type);
      return result;
    }

    Module m = moduleService.convertToModule(entity);
    String reportRequest = createRequestBody(m);
    String apiEndpoint = getReportAPIEndpoint(type);

    try {
      LOG.info("Requesting report (" + type + ") from remote URI " + reportGeneratorUri);
      LOG.debug("Request body: " + reportRequest);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);

      RequestEntity<String> requestEntity = RequestEntity.post(reportGeneratorUri + apiEndpoint)
          .contentType(MediaType.APPLICATION_JSON)
          .body(reportRequest);
      ResponseEntity<byte[]> response = restTemplate.exchange(requestEntity, byte[].class);

      if (response.getStatusCode().is2xxSuccessful()) {
        result = response.getBody();
      } else {
        resp.setStatus(HttpStatus.NOT_FOUND.value());

      }
    } catch (Exception e) {
      LOG.error("Can't load report from remote URI " + e.getMessage());
    }

    prepareResponse(resp, type);
    return result;
  }

  private String createRequestBody(Module m) {
    var uris = getsBomUri(m);

    StringBuffer uriString = new StringBuffer();
    for (String uri : uris) {
      uriString.append("\"" + uri + "\",");
    }
    String s = uriString.toString();
    String sbomUri = "[" + s.substring(0, s.lastIndexOf(",")) + "]";

    String reportRequest = "{\"sbomURI\":" + sbomUri + ",";
    reportRequest += "\"dcId\": 0,";
    reportRequest += "\"compact\": true,";
    reportRequest += "\"sbom\": []";
    reportRequest += "}";

    return reportRequest;
  }

  private String getReportAPIEndpoint(String type) {
    String apiEndpoint = "/api/report/remote";
    switch (type) {
      case "pdf":
        apiEndpoint = "/api/report/remote";
        break;
      case "spreadsheet":
        apiEndpoint = "/api/report/excel/remote";
        break;
      default:
        break;
    }
    return apiEndpoint;
  }

  private List<String> getsBomUri(Module m) {
    List<String> result = new ArrayList<>();
    for (var key : m.getsBOMLocation().keySet()) {
      ModuleSBOMLocationValue sbomLocation = m.getsBOMLocation().get(key);
      var uri = sbomLocation.getUrl();
      // simple sanity check, that URI is an actual HTTP address
      if (uri.contains("http")) {
        result.add(uri);
      }
    }
    return result;
  }

  private void prepareResponse(HttpServletResponse resp, String type) {
    String fileExtension = ".pdf";
    switch (type) {
      case "pdf":
        resp.setContentType("application/pdf");
        break;
      case "spreadsheet":
        resp.setContentType("application/vnd.ms-excel");
        fileExtension = ".xls";
        break;
      default:
        resp.setContentType("application/pdf");
        break;
    }

    DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd:hh:mm:ss");
    String currentDateTime = dateFormatter.format(new Date());
    String headerKey = "Content-Disposition";
    String headerValue = "attachment; filename=sbom_" + currentDateTime + fileExtension;

    resp.setHeader(headerKey, headerValue);
  }

}
