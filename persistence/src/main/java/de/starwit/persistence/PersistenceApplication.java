package de.starwit.persistence;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;

@Profile("!test")
@SpringBootApplication
public class PersistenceApplication {

}
