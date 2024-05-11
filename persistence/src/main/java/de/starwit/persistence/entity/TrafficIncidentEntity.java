package de.starwit.persistence.entity;

import java.time.ZonedDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * TrafficIncident Entity class
 */
@Entity
@Table(name = "trafficincident")
public class TrafficIncidentEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name="acquisitiontime")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime acquisitionTime;


    // entity relations
    @JsonFilter("filterId")
    @ManyToOne
    @JoinColumn(name = "trafficincidenttype_id")
    private TrafficIncidentTypeEntity trafficIncidentType;

    @JsonFilter("filterId")
    @OneToMany(mappedBy = "trafficIncident")
    private Set<MitigationActionEntity> mitigationAction;

    // entity fields getters and setters
    public ZonedDateTime getAcquisitionTime() {
        return acquisitionTime;
    }

    public void setAcquisitionTime(ZonedDateTime acquisitionTime) {
        this.acquisitionTime = acquisitionTime;
    }

    // entity relations getters and setters
    public TrafficIncidentTypeEntity getTrafficIncidentType() {
        return trafficIncidentType;
    }

    public void setTrafficIncidentType(TrafficIncidentTypeEntity trafficIncidentType) {
        this.trafficIncidentType = trafficIncidentType;
    }

    public Set<MitigationActionEntity> getMitigationAction() {
        return mitigationAction;
    }

    public void setMitigationAction(Set<MitigationActionEntity> mitigationAction) {
        this.mitigationAction = mitigationAction;
    }

}
