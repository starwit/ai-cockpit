package de.starwit.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZonedDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import de.starwit.persistence.repository.TrafficIncidentTypeRepository;
import jakarta.annotation.PostConstruct;

/**
 * Service class for importing sample data. Will only be executed,
 * if flag in application properties is set.
 */

@Service
public class PostFlywayService {

    static final Logger LOG = LoggerFactory.getLogger(PostFlywayService.class);

    @Value("${scenario.setup:false}")
    private boolean setupScenario = true;

    @Value("${scenario.importFolder:/scenariodata/traffic/}")
    private String scenarioImportFolder;

    private String mititgationTypeFileName = "mitigationtypes.json";

    private String incidentTypeFileName = "incidenttypes.json";

    private String demoDataFileName = "demodata.json";

    @Autowired
    private TrafficIncidentTypeRepository incidentTypeRepository;

    @Autowired
    private MitigationActionTypeRepository actionRepository;

    @Autowired
    private TrafficIncidentRepository incidentRepository;

    private static final ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        LOG.info("Importing sample data: " + setupScenario);
        if (setupScenario) {
            LOG.info("Importing sample data structure from folder " + scenarioImportFolder);
            if (importMitigationTypes(scenarioImportFolder)) {
                LOG.info("Import of mitigation types successful, importing incident types");
                if (importIncidentTypes(scenarioImportFolder)) {
                    importDemoData(scenarioImportFolder);
                }
            }
        }
    }

    private boolean importMitigationTypes(String folder) {
        if (actionRepository.findAll().size() > 0) {
            LOG.info("Mitigation types already imported. Skipping import.");
            return false;
        } else {
            File file = new File(folder + "/" + mititgationTypeFileName);
            if (file.exists()) {
                LOG.info("Importing mitigation types from file " + file.getAbsolutePath());
                try {
                    List<MitigationActionTypeEntity> mitigationTypes = mapper.readValue(file,
                            new TypeReference<List<MitigationActionTypeEntity>>() {
                            });
                    actionRepository.saveAll(mitigationTypes);
                } catch (IOException e) {
                    LOG.error("Can't parse mitigation types, aborting import " + e.getMessage());
                }
                return true;
            } else {
                LOG.warn("Mitigation types file not found. Skipping import.");
            }
        }
        return false;
    }

    private boolean importIncidentTypes(String folder) {
        if (incidentTypeRepository.findAll().size() > 0) {
            LOG.info("Incident types already imported. Skipping import.");
            return false;
        } else {
            File file = new File(folder + "/" + incidentTypeFileName);
            if (file.exists()) {
                LOG.info("Importing Incident types from file " + file.getAbsolutePath());
                try {
                    List<TrafficIncidentTypeEntity> trafficIncidentTypes = mapper.readValue(file,
                            new TypeReference<List<TrafficIncidentTypeEntity>>() {
                            });
                    incidentTypeRepository.saveAll(trafficIncidentTypes);
                } catch (IOException e) {
                    LOG.error("Can't parse Incident types, aborting import " + e.getMessage());
                }
                return true;
            } else {
                LOG.warn("Incident types file not found. Skipping import.");
            }
        }
        return false;
    }

    private boolean importDemoData(String folder) {
        File file = new File(folder + "/" + demoDataFileName);
        if (file.exists()) {
            LOG.info("Importing demo data from file " + file.getAbsolutePath());
            try {
                Path path = Path.of(folder + "/" + demoDataFileName);
                /*
                 * Incidents are displayed best, when timestamps are ordered.
                 * Here demo data are checked for marker DATETIME
                 */
                String content = Files.readString(path, StandardCharsets.UTF_8);
                int timeOffset = 13; // Incident timestamps are moved 13 hours in the past.
                while (content.indexOf("DATETIME") != -1) {
                    ZonedDateTime zd = ZonedDateTime.now().minusHours(timeOffset);
                    content = content.replaceFirst("DATETIME", zd.toString());
                    timeOffset -= 1;
                }
                List<TrafficIncidentEntity> trafficIncidentTypes = mapper.readValue(
                        content,
                        new TypeReference<List<TrafficIncidentEntity>>() {
                        });
                incidentRepository.saveAll(trafficIncidentTypes);
            } catch (IOException e) {
                LOG.error("Can't parse demo data, aborting import " + e.getMessage());
            }
            return true;
        } else {
            LOG.warn("Demo data file not found. Skipping import.");
        }
        return false;
    }

}
