package de.starwit.persistence.entity;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Module Entity class
 */
@Entity
@Table(name = "module")
public class ModuleEntity extends AbstractEntity<Long> {

    @Column(name = "description")
    private String description;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "module", cascade = { CascadeType.ALL })
    private Set<DecisionEntity> decision;

    @OneToMany(mappedBy = "module", cascade = { CascadeType.ALL })
    private Set<DecisionTypeEntity> decisionType;

    @OneToMany(mappedBy = "module", cascade = { CascadeType.ALL })
    private Set<ActionTypeEntity> actionType;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<DecisionEntity> getDecision() {
        return decision;
    }

    public void setDecision(Set<DecisionEntity> decision) {
        this.decision = decision;
    }

    public Set<DecisionTypeEntity> getDecisionType() {
        return decisionType;
    }

    public void setDecisionType(Set<DecisionTypeEntity> decisionType) {
        this.decisionType = decisionType;
    }

    public Set<ActionTypeEntity> getActionType() {
        return actionType;
    }

    public void setActionType(Set<ActionTypeEntity> actionType) {
        this.actionType = actionType;
    }
}
