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
 * Decision Entity class
 */
@Entity
@Table(name = "decision")
public class DecisionEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "acquisitiontime")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime acquisitionTime;

    @Column(name = "mediaurl")
    private String mediaUrl;

    @Column(name = "actionvisualizationurl")
    private String actionVisualizationUrl;

    @Column(name = "cameralatitude")
    private BigDecimal cameraLatitude;

    @Column(name = "cameralongitude")
    private BigDecimal cameraLongitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private DecisionState state;

    @Column(name = "description")
    private String description;

    // entity relations
    @JsonFilter("filterIdName")
    @ManyToOne
    @JoinColumn(name = "decisiontype_id")
    private DecisionTypeEntity decisionType;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private ModuleEntity module;


    @OneToMany(mappedBy = "decision", cascade = { CascadeType.ALL })
    private Set<ActionEntity> action;

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

    public String getActionVisualizationUrl() {
        return actionVisualizationUrl;
    }

    public void setActionVisualizationUrl(String actionVisualizationUrl) {
        this.actionVisualizationUrl = actionVisualizationUrl;
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

    public DecisionState getState() {
        return state;
    }

    public void setState(DecisionState state) {
        this.state = state;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // entity relations getters and setters
    public DecisionTypeEntity getDecisionType() {
        return decisionType;
    }

    public void setDecisionType(DecisionTypeEntity decisionType) {
        this.decisionType = decisionType;
    }

    public Set<ActionEntity> getAction() {
        return action;
    }

    public void setAction(Set<ActionEntity> action) {
        this.action = action;
    }

    public void addToAction(ActionEntity action) {
        action.setDecision(this);
        if (this.action == null) {
            this.action = new HashSet<>();
        }
        this.action.add(action);
        this.action.forEach(a -> a.setDecision(this));
    }

    public void removeFromAction(ActionEntity action) {
        action.setDecision(null);
        if (this.action == null) {
            return;
        }
        this.action.remove(action);
    }

}
