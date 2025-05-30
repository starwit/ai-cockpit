package de.starwit.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;

@Service
public class MinioService {

    @Value("${minio.user:minioadmin}")
    private String minioAccesskey;

    @Value("${minio.password:minioadmin}")
    private String minioSecretkey;

    @Value("${minio.endpoint:http://localhost:9000}")
    private String endpoint;

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

}
