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
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
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

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private DecisionTypeRepository decisionTypeRepository;

    @Autowired
    private MitigationActionTypeRepository mitigationActionTypeRepository;

    @Override
    public DecisionRepository getRepository() {
        return decisionRepository;
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
        return createDecisionEntitywithMitigationAction(entity);
    }

    public DecisionEntity createDecisionEntitywithMitigationAction(DecisionEntity entity) {
        DecisionTypeEntity decisionType = entity.getDecisionType();
        if (decisionType != null) {
            List<MitigationActionTypeEntity> actionTypes = mitigationActionTypeRepository
                    .findByDecisionType(decisionType.getId());
            if (actionTypes != null && !actionTypes.isEmpty()) {
                for (MitigationActionTypeEntity actionType : actionTypes) {
                    MitigationActionEntity action = new MitigationActionEntity();
                    action.setCreationTime(entity.getAcquisitionTime());
                    action.setMitigationActionType(actionType);
                    entity.addToMitigationAction(action);
                }
            }
        }
        return saveOrUpdate(entity);
    }

    public List<DecisionEntity> findAllWithoutDecisionType() {
        return decisionRepository.findAllWithoutDecisionType();
    }

    public List<DecisionEntity> findAllWithoutOtherDecisionType(Long id) {
        return decisionRepository.findAllWithoutOtherDecisionType(id);
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
