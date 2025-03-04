package de.starwit.service;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import de.starwit.persistence.entity.ExecutionPolicy;

@ApplicationScope
@Component
public class Automation {

    private ExecutionPolicy executionPolicy = ExecutionPolicy.AUTOMATIC;

    public ExecutionPolicy getExecutionPolicy() {
        return executionPolicy;
    }

    public void setExecutionPolicy(ExecutionPolicy executionPolicy) {
        this.executionPolicy = executionPolicy;
    }

}
