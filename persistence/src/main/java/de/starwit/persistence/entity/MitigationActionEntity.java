package de.starwit.persistence.entity;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * MitigationAction Entity class
 */
@Entity
@Table(name = "mitigationaction")
public class MitigationActionEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name="creationtime")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime creationTime;


    @Column(name = "name")
    private String name;


    @Column(name = "description")
    private String description;


    // entity relations
    @JsonFilter("filterId")
    @ManyToOne
    @JoinColumn(name = "trafficincident_id")
    private TrafficIncidentEntity trafficIncident;

    @ManyToOne
    @JoinColumn(name = "mitigationactiontype_id")
    private MitigationActionTypeEntity mitigationActionType;

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
    public TrafficIncidentEntity getTrafficIncident() {
        return trafficIncident;
    }

    public void setTrafficIncident(TrafficIncidentEntity trafficIncident) {
        this.trafficIncident = trafficIncident;
    }

    public MitigationActionTypeEntity getMitigationActionType() {
        return mitigationActionType;
    }

    public void setMitigationActionType(MitigationActionTypeEntity mitigationActionType) {
        this.mitigationActionType = mitigationActionType;
    }

}
