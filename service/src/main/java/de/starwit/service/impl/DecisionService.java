package de.starwit.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionRepository;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.visionapi.Reporting.IncidentMessage;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import jakarta.persistence.EntityManager;

/**
 * 
 * Decision Service class
 *
 */
@Service
public class DecisionService implements ServiceInterface<DecisionEntity, DecisionRepository> {

    @Value("${decision.type.default:dangerous driving behaviour}")
    private String defaultDecisionType;

    @Value("${decision.type.random:false}")
    private Boolean randomDecisionType;

    @Value("${minio.user:minioadmin}")
    private String minioAccesskey;

    @Value("${minio.password:minioadmin}")
    private String minioSecretkey;

    @Value("${minio.endpoint:http://localhost:9000}")
    private String endpoint;

    private final EntityManager entityManager;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private ActionTypeRepository actionTypeRepository;

    @Autowired
    private ActionRepository actionRepository;

    @Override
    public DecisionRepository getRepository() {
        return decisionRepository;
    }

    public List<DecisionEntity> findAllOpenDecisions() {
        return decisionRepository.findByState(DecisionState.NEW);
    }

    public List<DecisionEntity> findAllOpenDecisionsByModule(Long moduleId) {
        return decisionRepository.findByModuleIdAndState(moduleId, DecisionState.NEW);
    }

    public List<DecisionEntity> findAllByModule(Long moduleId) {
        List<DecisionEntity> result = decisionRepository.findByModuleId(moduleId);
        return result;
    }

    public DecisionService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public DecisionEntity createNewDecisionBasedOnIncidentMessage(IncidentMessage decisionMessage) {
        DecisionEntity entity = new DecisionEntity();
        entity.setMediaUrl(decisionMessage.getMediaUrl());
        ZonedDateTime dateTime = Instant.ofEpochMilli(decisionMessage.getTimestampUtcMs())
                .atZone(ZoneId.systemDefault());
        entity.setAcquisitionTime(dateTime);
        if (decisionMessage.hasCameraLocation()) {
            entity.setCameraLatitude(new BigDecimal(decisionMessage.getCameraLocation().getLatitude()));
            entity.setCameraLongitude(new BigDecimal(decisionMessage.getCameraLocation().getLongitude()));
        }
        entity.setState(DecisionState.NEW);
        DecisionTypeEntity decisionType = null;
        if (randomDecisionType) {
            List<DecisionTypeEntity> types = decisionTypeRepository.findAll();
            if (types != null) {
                int randomNum = (int) (Math.random() * types.size());
                decisionType = types.get(randomNum);
            }
        } else {
            decisionType = findDecisionTypeByName(defaultDecisionType);
        }
        entity.setDecisionType(decisionType);
        return createDecisionEntitywithAction(entity);
    }

    public DecisionEntity createDecisionEntitywithAction(DecisionEntity entity) {
        DecisionTypeEntity decisionType = entity.getDecisionType();
        if (decisionType != null) {
            List<ActionTypeEntity> actionTypes = actionTypeRepository
                    .findByDecisionType(decisionType.getId());
            addActions(entity, actionTypes);
        }
        entity = saveOrUpdate(entity);
        entityManager.detach(entity);

        return entity;
    }

    public DecisionEntity UpdateDecisionEntityWithAction(DecisionEntity toBeSaved, Set<Long> addedActionTypeIds,
            Set<Long> removedActionTypeIds) {
        DecisionEntity persisted = decisionRepository.findById(toBeSaved.getId()).get();
        persisted.setDecisionType(toBeSaved.getDecisionType());
        persisted.setDescription(toBeSaved.getDescription());
        persisted.setState(toBeSaved.getState());

        List<ActionTypeEntity> actionTypes = new ArrayList<>();
        for (Long id : addedActionTypeIds) {
            if (actionTypeRepository.existsById(id)) {
                ActionTypeEntity actionType = actionTypeRepository.getReferenceById(id);
                actionTypes.add(actionType);
            }
        }
        addActions(persisted, actionTypes);
        removeActions(persisted, removedActionTypeIds);
        persisted = saveOrUpdate(persisted);
        return persisted;
    }

    private void removeActions(DecisionEntity entity, Set<Long> removedActionTypeIds) {
        Set<ActionEntity> actions = entity.getAction();
        List<ActionEntity> removeActions = new ArrayList<>();
        if (actions == null) {
            return;
        }
        for (ActionEntity action : actions) {
            if (removedActionTypeIds.contains(action.getActionType().getId())
                    && (action.getState() == ActionState.NEW
                            || action.getState() == ActionState.CANCELED)) {
                removeActions.add(action);
            }
        }

        for (ActionEntity action : removeActions) {
            entity.removeFromAction(action);
            if (actionRepository.existsById(action.getId())) {
                actionRepository.deleteById(action.getId());
            }
        }
    }

    private void addActions(DecisionEntity entity, List<ActionTypeEntity> actionTypes) {
        if (actionTypes != null && !actionTypes.isEmpty()) {
            for (ActionTypeEntity actionType : actionTypes) {
                ActionEntity action = new ActionEntity();
                action.setCreationTime(entity.getAcquisitionTime());
                action.setActionType(actionType);
                if (entity.getId() != null) {
                    actionRepository.save(action);
                }
                entity.addToAction(action);
            }
        }
    }

    public byte[] getFileFromMinio(String bucketName, String objectName)
            throws InvalidKeyException, IOException, MinioException {
        try {
            MinioClient minioClient = MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(minioAccesskey, minioSecretkey)
                    .build();

            // Fetch the object from Minio
            InputStream objectStream;

            objectStream = minioClient
                    .getObject(GetObjectArgs.builder().bucket(bucketName).object(objectName).build());

            // Convert the InputStream to a Base64-encoded Byte[]
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = objectStream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            return baos.toByteArray();
        } catch (ErrorResponseException | InsufficientDataException | InternalException
                | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
                | IllegalArgumentException e) {
            throw new MinioException(e.getMessage());
        }
    }

    public DecisionTypeEntity findDecisionTypeByName(String name) {
        DecisionTypeEntity decisionType = null;
        List<DecisionTypeEntity> result = decisionTypeRepository.findByName(name);
        if (result != null && !result.isEmpty()) {
            decisionType = result.getFirst();
        }
        return decisionType;
    }
}
