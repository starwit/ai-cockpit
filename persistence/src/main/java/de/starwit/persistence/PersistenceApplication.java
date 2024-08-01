package de.starwit.persistence;

import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class PersistenceApplication {

    @PostConstruct
    void test() {
        System.out.println("+++++++ persistence init called");
    }

}
