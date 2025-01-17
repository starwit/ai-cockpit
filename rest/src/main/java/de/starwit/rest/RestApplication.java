package de.starwit.rest;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication(scanBasePackages = { "de.starwit.rest", "de.starwit.service", "de.starwit.persistence" })
public class RestApplication {

}
