package de.starwit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;

import de.starwit.persistence.entity.ExecutionPolicy;

@ApplicationScope
@Component
public class Automation {

    @Value("${automation:AUTOMATIC}")
    private ExecutionPolicy executionPolicy;

    public ExecutionPolicy getExecutionPolicy() {
        return executionPolicy;
    }

    public void setExecutionPolicy(ExecutionPolicy executionPolicy) {
        this.executionPolicy = executionPolicy;
    }

}
