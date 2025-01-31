package de.starwit.persistence.entity;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Action Entity class
 */
@Entity
@Table(name = "action")
public class ActionEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "creationtime")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime creationTime;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "metadata")
    private String metadata;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private ActionState state = ActionState.NEW;

    // entity relations
    @JsonFilter("filterId")
    @ManyToOne
    @JoinColumn(name = "decision_id")
    private DecisionEntity decision;

    @ManyToOne
    @JoinColumn(name = "actiontype_id")
    private ActionTypeEntity actionType;

    // entity fields getters and setters
    public ZonedDateTime getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(ZonedDateTime creationTime) {
        this.creationTime = creationTime;
    }

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
    public DecisionEntity getDecision() {
        return decision;
    }

    public void setDecision(DecisionEntity decision) {
        this.decision = decision;
    }

    public ActionTypeEntity getActionType() {
        return actionType;
    }

    public void setActionType(ActionTypeEntity actionType) {
        this.actionType = actionType;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public ActionState getState() {
        return state;
    }

    public void setState(ActionState state) {
        this.state = state;
    }
}
