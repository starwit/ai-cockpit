package de.starwit.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * AutonomyLevel Entity class
 */
@Entity
@Table(name = "autonomylevel")
public class AutonomyLevelEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "name")
    private String name;


    @Column(name = "description")
    private String description;


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

}
