package de.starwit.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
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

    @Override
    public DecisionRepository getRepository() {
        return decisionRepository;
    }

    public List<DecisionEntity> findAllOpenDecisions() {
        return decisionRepository.findByState(DecisionState.NEW);
    }

    public List<DecisionEntity> findAllOpenDecisionsByType(String typeName) {
        if ("all".equals(typeName)) {
            return findAllOpenDecisions();
        }
        return decisionRepository.findByStateAndDecisionType_Name(DecisionState.NEW, typeName);
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
        entity.setState(DecisionState.NEW);
        DecisionTypeEntity decisionType = findDecisionTypeByName(defaultDecisionType);
        entity.setDecisionType(decisionType);
        return createDecisionEntitywithAction(entity);
    }

    public DecisionEntity createDecisionEntitywithAction(DecisionEntity entity) {
        DecisionTypeEntity decisionType = entity.getDecisionType();
        if (decisionType != null) {
            List<ActionTypeEntity> actionTypes = actionTypeRepository
                    .findByDecisionType(decisionType.getId());
            if (actionTypes != null && !actionTypes.isEmpty()) {
                for (ActionTypeEntity actionType : actionTypes) {
                    ActionEntity action = new ActionEntity();
                    action.setCreationTime(entity.getAcquisitionTime());
                    action.setActionType(actionType);
                    entity.addToAction(action);
                }
            }
        }
        entity = saveOrUpdate(entity);
        entityManager.detach(entity);
        return entity;
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
