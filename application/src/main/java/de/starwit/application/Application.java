package de.starwit.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;

@SpringBootApplication(scanBasePackages = {
        "de.starwit.rest",
        "de.starwit.service",
        "de.starwit.persistence",
        "de.starwit.application.config"
}, exclude = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class })
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(new Class[] { Application.class }, args);
    }

    @Bean
    public ObjectMapper mapper() {
        ObjectMapper mapper = new ObjectMapper();

        SimpleFilterProvider filterProvider = new SimpleFilterProvider();
        filterProvider.addFilter("filterId", SimpleBeanPropertyFilter.filterOutAllExcept("id"));
        filterProvider.addFilter("filterIdName", SimpleBeanPropertyFilter.filterOutAllExcept("id", "name", "title"));
        mapper.setFilterProvider(filterProvider);
        return mapper;
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setConnectTimeout(3000);

        restTemplate.setRequestFactory(requestFactory);
        return restTemplate;
    }
}
