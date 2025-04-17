package de.starwit.rest.acceptance;

import static org.junit.jupiter.api.Assertions.*;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.starwit.aic.model.Module;

@SpringBootTest
public class TransparencyFunctionsControllerTests {

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void parseSampleData() throws Exception {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        InputStream inputStream = new ClassPathResource("transparencytestdata.json").getInputStream();
        Module[] mods = objectMapper.readValue(inputStream, Module[].class);
        List<Module> modules = Arrays.asList(mods);
        assertTrue(modules.size() > 0);
    }
}
