package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import de.starwit.persistence.entity.ModuleEntity;

/**
 * Module Repository class
 */
@Repository
public interface ModuleRepository extends JpaRepository<ModuleEntity, Long> {

    public List<ModuleEntity> findByName(String name);

    public ModuleEntity findFirstByNameLike(String name);
}
