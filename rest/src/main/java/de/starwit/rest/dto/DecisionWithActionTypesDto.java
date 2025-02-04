package de.starwit.rest.dto;

import java.util.Set;

import de.starwit.persistence.entity.DecisionEntity;

public class DecisionWithActionTypesDto {

    private DecisionEntity decision;

    private Set<Long> actionTypeIds;

    public DecisionEntity getDecision() {
        return decision;
    }

    public void setDecision(DecisionEntity decision) {
        this.decision = decision;
    }

    public Set<Long> getActionTypeIds() {
        return actionTypeIds;
    }

    public void setActionTypeIds(Set<Long> actionTypeIds) {
        this.actionTypeIds = actionTypeIds;
    }

}
