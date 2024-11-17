package de.starwit.application.config;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.flywaydb.core.api.callback.Callback;
import org.flywaydb.core.api.callback.Context;
import org.flywaydb.core.api.callback.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import de.starwit.persistence.repository.TrafficIncidentTypeRepository;

@Component
public class FlywayCallback implements Callback {

    static final Logger LOG = LoggerFactory.getLogger(FlywayCallback.class);

    @Value("${scenario.setup}")
    private boolean setupScenario = true;

    @Value("${scenario.importFolder}")
    private String scenarioImportFolder;

    @Autowired
    private TrafficIncidentTypeRepository ttRepository;

    @Autowired
    private MitigationActionTypeRepository mtRepository;

    @Autowired
    private TrafficIncidentRepository incidentRepository;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public boolean canHandleInTransaction(Event event, Context context) {
        return event == Event.AFTER_MIGRATE_OPERATION_FINISH;
    }

    @Override
    public String getCallbackName() {
        return "scenario setup";
    }

    @Override
    public void handle(Event event, Context context) {
        LOG.info("Importing sample data after event: " + event + " " + setupScenario);
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

    @Override
    public boolean supports(Event event, Context context) {
        return event == Event.AFTER_MIGRATE_OPERATION_FINISH;
    }

    private boolean importMitigationTypes(String folder) {
        if (mtRepository.findAll().size() > 0) {
            LOG.info("Mitigation types already imported. Skipping import.");
        } else {
            File file = new File(folder + "/mitigationtypes.json");
            if (file.exists()) {
                LOG.info("Importing mitigation types from file " + file.getAbsolutePath());
                try {
                    List<MitigationActionTypeEntity> mitigationTypes = mapper.readValue(file,
                            new TypeReference<List<MitigationActionTypeEntity>>() {
                            });
                    mtRepository.saveAll(mitigationTypes);
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
        if (ttRepository.findAll().size() > 0) {
            LOG.info("Incident types already imported. Skipping import.");
        } else {
            File file = new File(folder + "/incidenttypes.json");
            if (file.exists()) {
                LOG.info("Importing Incident types from file " + file.getAbsolutePath());
                try {
                    List<TrafficIncidentTypeEntity> trafficIncidentTypes = mapper.readValue(file,
                            new TypeReference<List<TrafficIncidentTypeEntity>>() {
                            });
                    ttRepository.saveAll(trafficIncidentTypes);
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
        File file = new File(folder + "/demodata.json");
        if (file.exists()) {
            LOG.info("Importing demo data from file " + file.getAbsolutePath());
            try {
                List<TrafficIncidentEntity> trafficIncidentTypes = mapper.readValue(file,
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
