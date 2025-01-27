package de.starwit.persistence.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "actiontype")
public class ActionTypeEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "executionpolicy")
    private ExecutionPolicies executionPolicy;

    // entity relations
    @JsonFilter("filterId")
    @OneToMany(mappedBy = "actionType")
    private Set<ActionEntity> action;

    @Column(name = "endpoint")
    private String endpoint;

    @JsonFilter("filterId")
    @ManyToMany(mappedBy = "actionType")
    private Set<DecisionTypeEntity> decisionType;

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
    public Set<ActionEntity> getAction() {
        return action;
    }

    public void setAction(Set<ActionEntity> action) {
        this.action = action;
    }

    public ExecutionPolicies getExecutionPolicy() {
        return executionPolicy;
    }

    public void setExecutionPolicy(ExecutionPolicies executionPolicy) {
        this.executionPolicy = executionPolicy;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public Set<DecisionTypeEntity> getDecisionType() {
        return decisionType;
    }

    public void setDecisionType(Set<DecisionTypeEntity> decisionType) {
        this.decisionType = decisionType;
    }

}
