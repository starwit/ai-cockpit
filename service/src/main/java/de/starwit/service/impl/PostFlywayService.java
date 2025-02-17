package de.starwit.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
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

    @Value("${default.module.name:traffic}")
    private String defaultModuleName;

    private String mititgationTypeFileName = "actiontypes.json";

    private String decisionTypeFileName = "decisiontypes.json";

    private String demoDataFileName = "demodata.json";

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private ActionTypeRepository actionRepository;

    @Autowired
    private DecisionService decisionService;

    @Autowired
    private ModuleService moduleService;

    private static final ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        LOG.info("Importing sample data: " + setupScenario);
        if (setupScenario) {
            LOG.info("Importing sample data structure from folder " + scenarioImportFolder);
            if (importactionTypes(scenarioImportFolder)) {
                LOG.info("Import of action types successful, importing decision types");
                if (importDecisionTypes(scenarioImportFolder)) {
                    importDemoData(scenarioImportFolder);
                }
            }
        }
    }

    private boolean importactionTypes(String folder) {
        if (actionRepository.findAll().size() > 0) {
            LOG.info("action types already imported. Skipping import.");
            return false;
        } else {
            File file = new File(folder + "/" + mititgationTypeFileName);
            if (file.exists()) {
                LOG.info("Importing action types from file " + file.getAbsolutePath());
                try {
                    List<ActionTypeEntity> actionTypes = mapper.readValue(file,
                            new TypeReference<List<ActionTypeEntity>>() {
                            });
                    processEntitiesWithModule(actionTypes , moduleService, this.defaultModuleName);
                    actionRepository.saveAll(actionTypes);
                } catch (IOException e) {
                    LOG.error("Can't parse action types, aborting import " + e.getMessage());
                }
                return true;
            } else {
                LOG.warn("action types file not found. Skipping import.");
            }
        }
        return false;
    }

    private boolean importDecisionTypes(String folder) {
        if (decisionTypeRepository.findAll().size() > 0) {
            LOG.info("Decision types already imported. Skipping import.");
            return false;
        } else {
            File file = new File(folder + "/" + decisionTypeFileName);
            if (file.exists()) {
                LOG.info("Importing Decision types from file " + file.getAbsolutePath());
                try {
                    List<DecisionTypeEntity> decisionTypes = mapper.readValue(file,
                            new TypeReference<List<DecisionTypeEntity>>() {
                            });

                    for (DecisionTypeEntity decisionTypeEntity : decisionTypes) {
                        Set<ActionTypeEntity> actionTypes = new java.util.HashSet<ActionTypeEntity>();
                        decisionTypeEntity.getActionType().forEach(actionType -> {
                            List<ActionTypeEntity> foundactionTypes = actionRepository.findByName(actionType.getName());
                            if (!foundactionTypes.isEmpty() || foundactionTypes.get(0).getName().equals(actionType.getName())) {
                                actionTypes.add(foundactionTypes.get(0));
                            } else {
                                LOG.error("Could not found actionType with the name " + actionType.getName());
                            }
                        });
                        decisionTypeEntity.setActionType(actionTypes);
                    }
                    
                    processEntitiesWithModule(decisionTypes , moduleService, this.defaultModuleName);
                    decisionTypeRepository.saveAll(decisionTypes);
                } catch (IOException e) {
                    LOG.error("Can't parse Decision types, aborting import " + e.getMessage());
                }
                return true;
            } else {
                LOG.warn("Decision types file not found. Skipping import.");
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
                 * Decisions are displayed best, when timestamps are ordered.
                 * Here demo data are checked for marker DATETIME
                 */
                String content = Files.readString(path, StandardCharsets.UTF_8);
                int timeOffset = 13; // Decision timestamps are moved 13 hours in the past.
                while (content.indexOf("DATETIME") != -1) {
                    ZonedDateTime zd = ZonedDateTime.now().minusHours(timeOffset);
                    content = content.replaceFirst("DATETIME", zd.toString());
                    timeOffset -= 1;
                }
                List<DecisionEntity> decisionTypes = mapper.readValue(
                        content,
                        new TypeReference<List<DecisionEntity>>() {
                        });
                for (DecisionEntity entity : decisionTypes) {
                    decisionService.createDecisionEntitywithAction(entity);
                }

            } catch (IOException e) {
                LOG.error("Can't parse demo data, aborting import " + e.getMessage());
            }
            return true;
        } else {
            LOG.warn("Demo data file not found. Skipping import.");
        }
        return false;
    }

    // Entity muss getModule() und setModule() haben
    public static <T> void processEntitiesWithModule(List<T> entities, ModuleService moduleService, String defaultModuleName) {
        for (T entity : entities) {
            try {
                
                ModuleEntity module = (ModuleEntity) entity.getClass().getMethod("getModule").invoke(entity);

                if (module == null || module.getName() == null) {
                    module = new ModuleEntity();
                    module.setName(defaultModuleName);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                }

                List<ModuleEntity> list = moduleService.findByName(module.getName());
                if (list.isEmpty() || !list.get(0).getName().equals(module.getName())) {
                    module = moduleService.saveOrUpdate(module);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                }else {
                    module = list.get(0);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                }
            } catch (Exception e) {
                throw new RuntimeException("Error processing entity: " + entity, e);
            }
        }
    }

}
