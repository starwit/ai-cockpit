package de.starwit.rest.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.transparency.model.Module;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "${rest.base-path}/transparency")
public class TransparencyFunctionsController {

  static final Logger LOG = LoggerFactory.getLogger(TransparencyFunctionsController.class);

  private List<Module> modules = new ArrayList<>();

  @Autowired
  private RestTemplate restTemplate;

  @Value("${sbom.enabled:false}")
  private boolean reportGenerationEnabled;

  @Value("${sbom.generator.uri:}")
  private String reportGeneratorUri;

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

  @Operation(summary = "true if report generation is enabled")
  @GetMapping(value = "/reports/enabled")
  public boolean isEnabled() {
    return reportGenerationEnabled;
  }

  @Operation(summary = "Get PDF report")
  @GetMapping(value = "/reports/{id}/{type}")
  public byte[] loadPDF(HttpServletResponse resp, @PathVariable("id") int id, @PathVariable("type") String type) {
    byte[] result = null;

    if (!reportGenerationEnabled || checkIfModuleExists(id)) {
      LOG.error("Report generation API called, but generation service is disabled - frontend bug.");
      prepareResponse(resp, type);
      return result;
    }

    Module m = modules.get(id);
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

  private boolean checkIfModuleExists(int id) {
    return id >= modules.size();
  }

  private String createRequestBody(Module m) {
    var uris = getsBOMUri(m);
    String sbomURI = uris.get(0);

    String reportRequest = "{\"sbomURI\":\"" + sbomURI + "\",";
    reportRequest += "\"dcId\": 0,";
    reportRequest += "\"compact\": true,";
    reportRequest += "\"sbom\": \"\"";
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

  private List<String> getsBOMUri(Module m) {
    List<String> result = new ArrayList<>();
    for (var key : m.getsBOMLocation().keySet()) {
      String sbomLocation = m.getsBOMLocation().get(key);
      if (sbomLocation.contains("http")) {
        result.add(sbomLocation);
      } else {
        // TODO it needs to be enforced elsewhere, that sbom location is a valid URI.
        // There is no way, healing this here.
        result.add("http://localhost:8081/ai-cockpit/" + sbomLocation);
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
