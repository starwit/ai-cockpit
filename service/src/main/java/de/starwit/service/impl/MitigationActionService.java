package de.starwit.service.impl;
import java.util.List;
import de.starwit.persistence.entity.MitigationActionEntity;
import de.starwit.persistence.repository.MitigationActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * 
 * MitigationAction Service class
 *
 */
@Service
public class MitigationActionService implements ServiceInterface<MitigationActionEntity, MitigationActionRepository> {

    @Autowired
    private MitigationActionRepository mitigationactionRepository;

    @Override
    public MitigationActionRepository getRepository() {
        return mitigationactionRepository;
    }

    public List<MitigationActionEntity> findAllWithoutTrafficIncident() {
        return mitigationactionRepository.findAllWithoutTrafficIncident();
    }

    public List<MitigationActionEntity> findAllWithoutOtherTrafficIncident(Long id) {
        return mitigationactionRepository.findAllWithoutOtherTrafficIncident(id);
    }
    public List<MitigationActionEntity> findAllWithoutMitigationActionType() {
        return mitigationactionRepository.findAllWithoutMitigationActionType();
    }

    public List<MitigationActionEntity> findAllWithoutOtherMitigationActionType(Long id) {
        return mitigationactionRepository.findAllWithoutOtherMitigationActionType(id);
    }

}
