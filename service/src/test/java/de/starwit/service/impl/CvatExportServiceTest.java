package de.starwit.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.visionapi.Sae.BoundingBox;
import de.starwit.visionapi.Sae.Detection;
import de.starwit.visionapi.Sae.ModelMetadata;
import de.starwit.visionapi.Sae.SaeMessage;

class CvatExportServiceTest {

    @Test
    void buildsShapesFromSaeDetections() throws Exception {
        SaeMessage sae = SaeMessage.newBuilder()
                .addDetections(detection(1, 0.25f, 0.25f, 0.5f, 0.75f))
                .addDetections(detection(2, 0f, 0f, 1f, 1f))
                .setModelMetadata(ModelMetadata.newBuilder()
                        .putClassNames(1, "car")
                        .putClassNames(2, "unknown"))
                .build();
        CvatExportService.CvatImage image = new CvatExportService.CvatImage(
                "bucket", "original.jpg", "file.jpg",
                sae.getDetectionsList(), sae.getModelMetadata().getClassNamesMap());
        JsonNode frames = new ObjectMapper().readTree("""
                [{"width": 200, "height": 100}]
                """);

        List<Map<String, Object>> shapes = CvatExportService.buildShapes(
                List.of(image), frames, Map.of("car", 7));

        assertEquals(List.of(Map.of(
                "type", "rectangle",
                "frame", 0,
                "label_id", 7,
                "points", List.of(50.0, 25.0, 100.0, 75.0),
                "source", "auto")), shapes);
    }

    private static Detection detection(int classId, float minX, float minY, float maxX, float maxY) {
        return Detection.newBuilder()
                .setClassId(classId)
                .setBoundingBox(BoundingBox.newBuilder()
                        .setMinX(minX).setMinY(minY).setMaxX(maxX).setMaxY(maxY))
                .build();
    }
}
