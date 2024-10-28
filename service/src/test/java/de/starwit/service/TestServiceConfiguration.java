package de.starwit.service;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.ComponentScan;

@TestConfiguration
@ComponentScan(basePackages = "de.starwit.persistence, de.starwit.service")
public class TestServiceConfiguration {

}
