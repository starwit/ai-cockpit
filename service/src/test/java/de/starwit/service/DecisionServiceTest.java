package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionRepository;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.impl.DecisionTypeService;
import de.starwit.service.impl.ModuleService;
import de.starwit.visionapi.Common.GeoCoordinate;
import de.starwit.visionapi.Reporting.IncidentMessage;
import jakarta.persistence.EntityNotFoundException;

@Import(TestServiceConfiguration.class)
@Transactional
@SpringBootTest
public class DecisionServiceTest {

        @Autowired
        DecisionTypeRepository decisionTypeRepository;

        @Autowired
        ActionTypeRepository actionTypeRepository;

        @Value("${default.module.name:Anomaly Detection}")
        private String anomalyDetectionName;

        @Value("${decision.type.default:dangerous driving behaviour}")
        private String defaultDecisionTypeName;

        @Autowired
        ActionRepository actionRepository;

        @Autowired
        private DecisionService decisionService;

        @Autowired
        private DecisionTypeService decisionTypeService;

        @Autowired
        private ModuleService moduleService;

        private static Long decisionId;

        private DecisionTypeEntity getDefaultDecisionType() {
                ModuleEntity module = getDefaultModule();
                DecisionTypeEntity defaultDecisionType = decisionTypeService
                                .findFirstByNameLikeAndModuleId(defaultDecisionTypeName, module.getId());
                if (defaultDecisionType == null) {
                        defaultDecisionType = new DecisionTypeEntity();
                        defaultDecisionType.setName(defaultDecisionTypeName);
                        defaultDecisionType.setModule(module);

                        ActionTypeEntity actionType = new ActionTypeEntity();
                        actionType.setDescription("Notify public platforms or apps about the traffic decision");
                        actionType.setName("notify public platform");
                        actionType.setExecutionPolicy(ExecutionPolicy.AUTOMATIC);
                        actionType.setModule(module);
                        actionType = actionTypeRepository.save(actionType);

                        ActionTypeEntity actionType2 = new ActionTypeEntity();
                        actionType2.setDescription("Notify police");
                        actionType2.setName("notify police");
                        actionType2.setExecutionPolicy(ExecutionPolicy.WITHCHECK);
                        actionType2.setModule(module);
                        actionType2 = actionTypeRepository.save(actionType2);

                        Set<ActionTypeEntity> actionTypes = new HashSet<>();
                        defaultDecisionType.setActionType(actionTypes);
                        actionTypes.add(actionType);
                        actionTypes.add(actionType2);
                        defaultDecisionType = decisionTypeService.saveOrUpdate(defaultDecisionType);
                }
                return defaultDecisionType;
        }

        private ModuleEntity getDefaultModule() {
                ModuleEntity module = moduleService.findFirstByNameLike(anomalyDetectionName);
                if (module == null) {
                        module = new ModuleEntity();
                        module.setName(anomalyDetectionName);
                        module = moduleService.saveOrUpdate(module);
                }
                return module;
        }

        private DecisionEntity getDefaultDecision() {

                try {
                        if (decisionId != null) {
                                return decisionService.findById(decisionId);
                        }
                } catch (EntityNotFoundException e) {
                        // ignore and continue
                }

                // prepare
                DecisionTypeEntity descisionType = getDefaultDecisionType();
                long timestamp = 1633046400000L;
                DecisionEntity decision = new DecisionEntity();
                ZonedDateTime expectedDateTime = Instant.ofEpochMilli(timestamp)
                                .atZone(ZoneId.systemDefault());
                decision.setMediaUrl("http://testurl.com/media");
                decision.setAcquisitionTime(expectedDateTime);

                decision.setDecisionType(descisionType);
                decision.setModule(descisionType.getModule());

                // Call Methode
                DecisionEntity result = decisionService
                                .createDecisionEntitywithAction(decision);

                decisionId = result.getId();
                return result;

        }

        @Test
        @Commit
        @Order(1)
        void testCreateNewDecisionWithActionsMessage() {

                // prepare
                getDefaultDecisionType();
                long timestamp = 1633046400001L;
                IncidentMessage decisionMessage = IncidentMessage.newBuilder()
                                .setMediaUrl("http://testurl.com/media")
                                .setTimestampUtcMs(timestamp)
                                .build();

                // Call Methode
                DecisionEntity result = decisionService
                                .createNewDecisionBasedOnIncidentMessage(decisionMessage);

                // Assert
                assertEquals("http://testurl.com/media", result.getMediaUrl());
                ZonedDateTime expectedDateTime = Instant.ofEpochMilli(timestamp)
                                .atZone(ZoneId.systemDefault());
                assertTrue(expectedDateTime.isEqual(result.getAcquisitionTime()));
                assertEquals(expectedDateTime, result.getAcquisitionTime());
                assertEquals(2, result.getAction().size());
                ActionEntity action = result.getAction().iterator().next();
                assertTrue(expectedDateTime.isEqual(action.getCreationTime()));
        }

        @Test
        @Commit
        @Order(2)
        void testCreateNewDecisionWithGeoLocation() {

                // prepare
                getDefaultDecisionType();
                long timestamp = 1633046400002L;
                GeoCoordinate coordinates = GeoCoordinate.newBuilder()
                                .setLatitude(38.97)
                                .setLongitude(40.78)
                                .build();
                IncidentMessage decisionMessage = IncidentMessage.newBuilder()
                                .setMediaUrl("http://testurl.com/media")
                                .setTimestampUtcMs(timestamp)
                                .setCameraLocation(coordinates)
                                .build();

                // Call Methode
                DecisionEntity result = decisionService
                                .createNewDecisionBasedOnIncidentMessage(decisionMessage);

                // Assert
                assertEquals(new BigDecimal(38.97), result.getCameraLatitude());
                assertEquals(new BigDecimal(40.78), result.getCameraLongitude());
        }

        @Test
        @Commit
        @Order(3)
        void testCreateNewDecisionWithActions() {

                // prepare
                DecisionTypeEntity descisionType = getDefaultDecisionType();
                long timestamp = 1633046400000L;
                DecisionEntity decision = new DecisionEntity();
                ZonedDateTime expectedDateTime = Instant.ofEpochMilli(timestamp)
                                .atZone(ZoneId.systemDefault());
                decision.setMediaUrl("http://testurl.com/media");
                decision.setAcquisitionTime(expectedDateTime);

                decision.setDecisionType(descisionType);
                decision.setModule(descisionType.getModule());

                // Call Methode
                DecisionEntity result = decisionService
                                .createDecisionEntitywithAction(decision);

                // Assert
                assertEquals("http://testurl.com/media", result.getMediaUrl());
                assertEquals(2, result.getAction().size());
                ActionEntity action = result.getAction().iterator().next();
                assertTrue(expectedDateTime.isEqual(action.getCreationTime()));

        }

        @Test
        @Commit
        @Order(4)
        void testUpdateDecisionWithActions() {

                // prepare
                DecisionEntity decision = getDefaultDecision();
                assertEquals(defaultDecisionTypeName, decision.getDecisionType().getName());

                ActionTypeEntity actionType = new ActionTypeEntity();
                actionType.setDescription("New Action");
                actionType.setName("\"New Action");
                actionType.setExecutionPolicy(ExecutionPolicy.WITHCHECK);
                actionType.setModule(getDefaultModule());
                actionType = actionTypeRepository.save(actionType);

                Set<ActionEntity> actions = decision.getAction();

                decision.setState(DecisionState.ACCEPTED);
                Set<Long> removedActionTypeIds = new HashSet<>();
                removedActionTypeIds.add(actions.iterator().next().getActionType().getId());

                Set<Long> addedActionTypeIds = new HashSet<>();
                addedActionTypeIds.add(actionType.getId());

                // Call Methode
                DecisionEntity result = decisionService.UpdateDecisionEntityWithAction(decision, addedActionTypeIds,
                                removedActionTypeIds);

                // Assert
                actions = result.getAction();
                List<Long> resultActionTypeIds = new ArrayList<>();
                for (ActionEntity action : actions) {
                        resultActionTypeIds.add(action.getActionType().getId());
                }

                assertEquals(2, resultActionTypeIds.size());
                assertTrue(resultActionTypeIds.containsAll(addedActionTypeIds));
                resultActionTypeIds.retainAll(removedActionTypeIds);
                assertEquals(0, resultActionTypeIds.size());
                assertEquals(DecisionState.ACCEPTED, result.getState());

                List<ActionEntity> actionsWithoutDecisions = actionRepository.findAllWithoutDecision();
                assertEquals(0, actionsWithoutDecisions.size());
        }

        @Test
        @Commit
        @Order(5)
        void testFindByName() {
                // prepare
                ModuleEntity module = getDefaultModule();
                DecisionTypeEntity defaultDecisionType = new DecisionTypeEntity();
                defaultDecisionType.setName("Testname");
                defaultDecisionType.setModule(module);
                decisionTypeService.saveOrUpdate(defaultDecisionType);

                // Call-Methode
                DecisionTypeEntity entity = decisionService.findDecisionTypeByNameOrId("Testname", null,
                                module.getId());

                // Assert
                assertTrue(entity.getName().equals("Testname"));

        }
}
