package de.starwit.persistence.entity;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Column(name = "acquisitiontime")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime acquisitionTime;

    @Column(name = "mediaurl")
    private String mediaUrl;

    @Column(name = "cameralatitude")
    private BigDecimal cameraLatitude;

    @Column(name = "cameralongitude")
    private BigDecimal cameraLongitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private IncidentState state;

    @Column(name = "description")
    private String description;

    // entity relations
    @JsonFilter("filterIdName")
    @ManyToOne
    @JoinColumn(name = "trafficincidenttype_id")
    private TrafficIncidentTypeEntity trafficIncidentType;

    @OneToMany(mappedBy = "trafficIncident", cascade = { CascadeType.ALL })
    private Set<MitigationActionEntity> mitigationAction;

    // entity fields getters and setters
    public ZonedDateTime getAcquisitionTime() {
        return acquisitionTime;
    }

    public void setAcquisitionTime(ZonedDateTime acquisitionTime) {
        this.acquisitionTime = acquisitionTime;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public BigDecimal getCameraLatitude() {
        return cameraLatitude;
    }

    public void setCameraLatitude(BigDecimal cameraLatitude) {
        this.cameraLatitude = cameraLatitude;
    }

    public BigDecimal getCameraLongitude() {
        return cameraLongitude;
    }

    public void setCameraLongitude(BigDecimal cameraLongitude) {
        this.cameraLongitude = cameraLongitude;
    }

    public IncidentState getState() {
        return state;
    }

    public void setState(IncidentState state) {
        this.state = state;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public void addToMitigationAction(MitigationActionEntity mitigationAction) {
        mitigationAction.setTrafficIncident(this);
        if (this.mitigationAction == null) {
            this.mitigationAction = new HashSet<>();
        }
        this.mitigationAction.add(mitigationAction);
    }

}
