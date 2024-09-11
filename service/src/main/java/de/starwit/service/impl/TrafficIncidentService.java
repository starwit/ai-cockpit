package de.starwit.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.TrafficIncidentEntity;
import de.starwit.persistence.repository.TrafficIncidentRepository;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;

/**
 * 
 * TrafficIncident Service class
 *
 */
@Service
public class TrafficIncidentService implements ServiceInterface<TrafficIncidentEntity, TrafficIncidentRepository> {

    @Autowired
    private TrafficIncidentRepository trafficincidentRepository;

    @Override
    public TrafficIncidentRepository getRepository() {
        return trafficincidentRepository;
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
                    .credentials("g55RANQWfPEdza3QDTck", "l0XQF9CZ3tr9TpLv9R3Uckeru4ZXVKAcKyDXRPHu")
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
}
