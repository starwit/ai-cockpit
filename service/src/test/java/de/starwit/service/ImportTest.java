package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import de.starwit.aic.model.Module;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
public class ImportTest {

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void parseSampleData() throws Exception {
        InputStream inputStream = new ClassPathResource("transparencytestdata.json").getInputStream();
        Module[] mods = objectMapper.readValue(inputStream, Module[].class);
        List<Module> modules = Arrays.asList(mods);
        assertTrue(modules.size() > 0);
    }
}
