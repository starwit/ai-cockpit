package de.starwit.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.aic.model.Module;
import de.starwit.aic.model.Decision;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.service.mapper.DecisionMapper;
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

    @Value("${default.module.name:Anomaly Detection}")
    private String defaultModuleName;

    private String moduleDataFileName = "moduledata.json";

    private String mititgationTypeFileName = "actiontypes.json";

    private String decisionTypeFileName = "decisiontypes.json";

    private String demoDataFileName = "demodata.json";

    DecisionMapper decisionMapper = new DecisionMapper();

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private ActionTypeRepository actionRepository;

    @Autowired
    private DecisionService decisionService;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private ObjectMapper mapper;

    @PostConstruct
    public void init() {
        LOG.info("Importing sample data: " + setupScenario);
        if (setupScenario) {
            LOG.info("Importing sample data structure from folder " + scenarioImportFolder);
            LOG.info("Import module data...");
            if (importModuleData()) {
                if (importactionTypes()) {
                    LOG.info("Import of action types successful, importing decision types");
                    if (importDecisionTypes()) {
                        LOG.info("Import of desicion types successful, importing demo data");
                        importDemoData();
                    }
                }
            }
        }
    }

    private boolean importModuleData() {
        if (moduleService.findAll().size() > 0) {
            LOG.info("Module data already imported. Skipping import.");
            return false;
        }
        File file = new File(scenarioImportFolder + "/" + moduleDataFileName);
        if (file.exists()) {
            List<Module> result = new ArrayList<>();
            try {
                LOG.info("Importing module data from file " + file.getAbsolutePath());
                Module[] mods = mapper.readValue(file, Module[].class);
                result = new ArrayList<>(Arrays.asList(mods));

                for (Module module : result) {
                    try {
                        moduleService.saveOrUpdate(module);
                    } catch (Exception e) {
                        LOG.error("Error importing default data: " + e.getMessage());
                    }
                }
                return true;
            } catch (IOException e) {
                LOG.error("Can't load module data " + e.getMessage());
                return false;
            }
        } else {
            LOG.warn("Module data file not found. Skipping import.");
            return false;
        }
    }

    private boolean importactionTypes() {
        if (actionRepository.findAll().size() > 0) {
            LOG.info("action types already imported. Skipping import.");
            return false;
        } else {
            File file = new File(scenarioImportFolder + "/" + mititgationTypeFileName);
            if (file.exists()) {
                LOG.info("Importing action types from file " + file.getAbsolutePath());
                try {
                    List<ActionTypeEntity> actionTypes = mapper.readValue(file,
                            new TypeReference<List<ActionTypeEntity>>() {
                            });
                    processEntitiesWithModule(actionTypes, moduleService, this.defaultModuleName);
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

    private boolean importDecisionTypes() {
        if (decisionTypeRepository.findAll().size() > 0) {
            LOG.info("Decision types already imported. Skipping import.");
            return false;
        } else {
            File file = new File(scenarioImportFolder + "/" + decisionTypeFileName);
            if (file.exists()) {
                LOG.info("Importing Decision types from file " + file.getAbsolutePath());
                try {
                    List<DecisionTypeEntity> decisionTypes = mapper.readValue(file,
                            new TypeReference<List<DecisionTypeEntity>>() {
                            });

                    for (DecisionTypeEntity decisionTypeEntity : decisionTypes) {
                        Set<ActionTypeEntity> actionTypes = mapActionTypesByName(decisionTypeEntity.getActionType());
                        decisionTypeEntity.setActionType(actionTypes);
                    }
                    processEntitiesWithModule(decisionTypes, moduleService, this.defaultModuleName);
                    decisionTypeRepository.saveAll(decisionTypes);
                } catch (IOException | IndexOutOfBoundsException e) {
                    LOG.error("Can't parse Decision types, aborting import " + e.getMessage());
                }
                return true;
            } else {
                LOG.warn("Decision types file not found. Skipping import.");
            }
        }
        return false;
    }

    private Set<ActionTypeEntity> mapActionTypesByName(Set<ActionTypeEntity> decisionActionTypes) {
        Set<ActionTypeEntity> actionTypes = new java.util.HashSet<ActionTypeEntity>();
        if (!decisionActionTypes.isEmpty()) {
            for (ActionTypeEntity actionType : decisionActionTypes) {
                List<ActionTypeEntity> foundactionTypes = actionRepository.findByName(actionType.getName());
                if (!foundactionTypes.isEmpty() &&
                        foundactionTypes.get(0).getName().equals(actionType.getName())) {
                    actionTypes.add(foundactionTypes.get(0));
                } else {
                    LOG.error("Could not found actionType with the name " + actionType.getName());
                }
            }
        }
        return actionTypes;
    }

    private boolean importDemoData() {
        File file = new File(scenarioImportFolder + "/" + demoDataFileName);
        if (file.exists()) {
            LOG.info("Importing demo data from file " + file.getAbsolutePath());
            try {
                Path path = Path.of(scenarioImportFolder + "/" + demoDataFileName);
                /*
                 * Decisions are displayed best, when timestamps are ordered.
                 * Here demo data are checked for marker DATETIME
                 */
                String content = Files.readString(path, StandardCharsets.UTF_8);
                int timeOffset = 13; // Decision timestamps are moved 13 hours in the past.
                while (content.indexOf("DATETIME") != -1) {
                    OffsetDateTime zd = OffsetDateTime.now().minusHours(timeOffset);
                    content = content.replaceFirst("DATETIME", zd.toString());
                    timeOffset -= 1;
                }
                List<Decision> decision = mapper.readValue(
                        content,
                        new TypeReference<List<Decision>>() {
                        });
                for (Decision dto : decision) {
                    DecisionEntity entity = decisionMapper.toEntity(dto);
                    decisionService.createDecisionEntitywithAction(entity);
                }

            } catch (IOException | IndexOutOfBoundsException e) {
                LOG.error("Can't parse demo data, aborting import " + e.getMessage());
            }
            return true;
        } else {
            LOG.warn("Demo data file not found. Skipping import.");
        }
        return false;
    }

    // Entity muss getModule() und setModule() haben
    public static <T> void processEntitiesWithModule(List<T> entities, ModuleService moduleService,
            String defaultModuleName) {
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
                } else {
                    module = list.get(0);
                    entity.getClass().getMethod("setModule", ModuleEntity.class).invoke(entity, module);
                }
            } catch (Exception e) {
                throw new RuntimeException("Error processing entity: " + entity, e);
            }
        }
    }

}
