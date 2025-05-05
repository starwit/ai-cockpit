package de.starwit.persistence.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
    private ExecutionPolicy executionPolicy;

    // entity relations
    @JsonIgnore
    @OneToMany(mappedBy = "actionType")
    private Set<ActionEntity> action;

    @Column(name = "endpoint")
    private String endpoint;

    @JsonFilter("filterId")
    @ManyToMany(mappedBy = "actionType")
    private Set<DecisionTypeEntity> decisionType;

    @JsonFilter("filterIdName")
    @ManyToOne
    @JoinColumn(name = "module_id")
    private ModuleEntity module;

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

    public ExecutionPolicy getExecutionPolicy() {
        return executionPolicy;
    }

    public void setExecutionPolicy(ExecutionPolicy executionPolicy) {
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

    public ModuleEntity getModule() {
        return module;
    }

    public void setModule(ModuleEntity module) {
        this.module = module;
    }

}
