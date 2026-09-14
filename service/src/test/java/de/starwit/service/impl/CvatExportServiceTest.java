package de.starwit.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

class CvatExportServiceTest {

    @Test
    void buildsShapesFromDetections() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        List<JsonNode> detectionsByFrame = List.of(objectMapper.readTree("""
                [
                  {
                    "label": "car",
                    "boundingBox": {"minX": 0.1, "minY": 0.2, "maxX": 0.5, "maxY": 0.8}
                  },
                  {
                    "label": "unknown",
                    "boundingBox": {"minX": 0.0, "minY": 0.0, "maxX": 1.0, "maxY": 1.0}
                  }
                ]
                """));
        JsonNode frames = objectMapper.readTree("""
                [{"width": 200, "height": 100}]
                """);

        List<Map<String, Object>> shapes = CvatExportService.buildShapes(
                detectionsByFrame, frames, Map.of("car", 7));

        assertEquals(List.of(Map.of(
                "type", "rectangle",
                "frame", 0,
                "label_id", 7,
                "points", List.of(20.0, 20.0, 100.0, 80.0),
                "source", "auto")), shapes);
    }
}
