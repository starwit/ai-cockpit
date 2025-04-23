package de.starwit.service;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@TestConfiguration
@ComponentScan(basePackages = "de.starwit.persistence, de.starwit.service")
public class TestServiceConfiguration {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setConnectTimeout(3000);

        restTemplate.setRequestFactory(requestFactory);
        return restTemplate;
    }

    @Bean
    public ObjectMapper mapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        SimpleFilterProvider filterProvider = new SimpleFilterProvider();
        filterProvider.addFilter("filterName", SimpleBeanPropertyFilter.filterOutAllExcept("name"));
        filterProvider.addFilter("filterId", SimpleBeanPropertyFilter.filterOutAllExcept("id"));
        filterProvider.addFilter("filterIdName", SimpleBeanPropertyFilter.filterOutAllExcept("id", "name", "title"));
        mapper.setFilterProvider(filterProvider);
        return mapper;
    }
}
