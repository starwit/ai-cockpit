package de.starwit.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.IncidentState;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.entity.MitigationActionTypeEntity;
import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.entity.TrafficIncidentTypeEntity;
import de.starwit.persistence.repository.MitigationActionTypeRepository;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import de.starwit.persistence.repository.TrafficIncidentTypeRepository;
import de.starwit.visionapi.Reporting.IncidentMessage;

/**
 * 
 * TrafficIncident Service class
 *
 */
@Service
public class TrafficIncidentService implements ServiceInterface<TrafficIncidentEntity, TrafficIncidentRepository> {

    @Value("${incident.type.default:Gefahrensituation}")
    private String defaultIncidentType;

    @Value("${minio.user:minioadmin}")
    private String minioAccesskey;

    @Value("${minio.password:minioadmin}")
    private String minioSecretkey;

    @Autowired
    private TrafficIncidentRepository trafficincidentRepository;

    @Autowired
    private TrafficIncidentTypeRepository trafficIncidentTypeRepository;

    @Autowired
    private MitigationActionTypeRepository mitigationActionTypeRepository;

    @Override
    public TrafficIncidentRepository getRepository() {
        return trafficincidentRepository;
    }

    public TrafficIncidentEntity createNewIncidentWithMitigationActionsMessage(IncidentMessage incidentMessage) {
        TrafficIncidentEntity entity = new TrafficIncidentEntity();
        entity.setMediaUrl(incidentMessage.getMediaUrl());
        ZonedDateTime dateTime = Instant.ofEpochMilli(incidentMessage.getTimestampUtcMs())
                .atZone(ZoneId.systemDefault());
        entity.setAcquisitionTime(dateTime);
        entity.setState(IncidentState.NEW);
        TrafficIncidentTypeEntity incidentType = findIncidentTypeByName(defaultIncidentType);
        entity.setTrafficIncidentType(incidentType);
        return addMitigationActionsToIncidentEntity(entity);
    }

    public TrafficIncidentEntity addMitigationActionsToIncidentEntity(TrafficIncidentEntity entity) {
        TrafficIncidentTypeEntity incidentType = entity.getTrafficIncidentType();
        if (incidentType != null) {
            List<MitigationActionTypeEntity> actionTypes = mitigationActionTypeRepository
                    .findByTrafficIncidentType(incidentType.getId());
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

    public List<TrafficIncidentEntity> findAllWithoutTrafficIncidentType() {
        return trafficincidentRepository.findAllWithoutTrafficIncidentType();
    }

    public List<TrafficIncidentEntity> findAllWithoutOtherTrafficIncidentType(Long id) {
        return trafficincidentRepository.findAllWithoutOtherTrafficIncidentType(id);
    }

    public byte[] getFileFromMinio(String bucketName, String objectName) {
        try {
            MinioClient minioClient = MinioClient.builder()
                    .endpoint("http://localhost:9000")
                    .credentials(minioAccesskey, minioSecretkey)
                    .build();

            // Fetch the object from Minio
            InputStream objectStream = minioClient
                    .getObject(GetObjectArgs.builder().bucket(bucketName).object(objectName).build());

            // Convert the InputStream to a Base64-encoded Byte[]
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = objectStream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public TrafficIncidentTypeEntity findIncidentTypeByName(String name) {
        TrafficIncidentTypeEntity incidentType = null;
        List<TrafficIncidentTypeEntity> result = trafficIncidentTypeRepository.findByName(name);
        if (result != null && !result.isEmpty()) {
            incidentType = result.getFirst();
        }
        return incidentType;
    }
}
