package de.starwit.persistence.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * MitigationActionType Entity class
 */
@Entity
@Table(name = "mitigationactiontype")
public class MitigationActionTypeEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "name")
    private String name;


    @Column(name = "description")
    private String description;


    // entity relations
    @JsonFilter("filterId")
    @JsonIgnore
    @OneToMany(mappedBy = "mitigationActionType", cascade = {CascadeType.ALL})
    private Set<MitigationActionEntity> mitigationAction;

    // entity fields getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // entity relations getters and setters
    public Set<MitigationActionEntity> getMitigationAction() {
        return mitigationAction;
    }

    public void setMitigationAction(Set<MitigationActionEntity> mitigationAction) {
        this.mitigationAction = mitigationAction;
    }

}
