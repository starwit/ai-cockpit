package de.starwit.service.impl;
import de.starwit.persistence.entity.AutonomyLevelEntity;
import de.starwit.persistence.repository.AutonomyLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * 
 * AutonomyLevel Service class
 *
 */
@Service
public class AutonomyLevelService implements ServiceInterface<AutonomyLevelEntity, AutonomyLevelRepository> {

    @Autowired
    private AutonomyLevelRepository autonomylevelRepository;

    @Override
    public AutonomyLevelRepository getRepository() {
        return autonomylevelRepository;
    }


}
