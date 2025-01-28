package de.starwit.persistence.entity;

import java.util.function.Function;

public enum ExecutionPolicy {
    AUTOMATIC((action) -> true),
    WITHCHECK((action) -> action.getDecision() != null && action.getDecision().getState() == DecisionState.ACCEPTED),
    MANUAL((action) -> false);

    private Function<ActionEntity, Boolean> allowFunction = (action) -> false;

    private ExecutionPolicy(Function<ActionEntity, Boolean> allowFunction) {
        this.allowFunction = allowFunction;
    }

    public boolean allow(ActionEntity action) {
        return this.allowFunction.apply(action);
    }

}
