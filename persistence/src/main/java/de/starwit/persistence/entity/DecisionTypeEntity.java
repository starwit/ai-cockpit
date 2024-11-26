package de.starwit.persistence.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "decisiontype")
public class DecisionTypeEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    // entity relations
    @OneToMany(mappedBy = "decisionType", cascade = { CascadeType.ALL })
    private Set<DecisionEntity> decision;

    @JsonFilter("filterId")
    @ManyToMany(cascade = CascadeType.REFRESH)
    @JoinTable(name = "decisiontype_actiontype", joinColumns = @JoinColumn(name = "decisiontype_id"), inverseJoinColumns = @JoinColumn(name = "actiontype_id"))
    private Set<ActionTypeEntity> actionType;

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
    public Set<DecisionEntity> getDecision() {
        return decision;
    }

    public void setDecision(Set<DecisionEntity> decision) {
        this.decision = decision;
    }

    public Set<ActionTypeEntity> getActionType() {
        return actionType;
    }

    public void setActionType(Set<ActionTypeEntity> actionType) {
        this.actionType = actionType;
    }

}
