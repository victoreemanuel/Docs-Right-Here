package com.drh.server.card.Service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;
import io.minio.SetBucketPolicyArgs;

@Service
public class FileStorageService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.url}")
    private String minioUrl;

    public String uploadFile(MultipartFile file) {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
            String publicPolicyJson = "{\n" +
                    "    \"Version\": \"2012-10-17\",\n" +
                    "    \"Statement\": [\n" +
                    "        {\n" +
                    "            \"Effect\": \"Allow\",\n" +
                    "            \"Principal\": {\"AWS\": [\"*\"]},\n" +
                    "            \"Action\": [\"s3:GetObject\"],\n" +
                    "            \"Resource\": [\"arn:aws:s3:::" + bucketName + "/*\"]\n" +
                    "        }\n" +
                    "    ]\n" +
                    "}";

            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder().bucket(bucketName).config(publicPolicyJson).build()
            );

            String novoNome = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(novoNome)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            return minioUrl + "/" + bucketName + "/" + novoNome;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload do ficheiro para o MinIO: " + e.getMessage(), e);
        }
    }
}