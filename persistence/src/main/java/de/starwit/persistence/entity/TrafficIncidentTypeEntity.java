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
@Table(name = "trafficincidenttype")
public class TrafficIncidentTypeEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "name")
    private String name;

    // entity relations
    @OneToMany(mappedBy = "trafficIncidentType", cascade = { CascadeType.ALL })
    private Set<TrafficIncidentEntity> trafficIncident;

    @JsonFilter("filterId")
    @ManyToMany(cascade = CascadeType.REFRESH)
    @JoinTable(name = "trafficincidenttype_mitigationactiontype", joinColumns = @JoinColumn(name = "trafficincidenttype_id"), inverseJoinColumns = @JoinColumn(name = "mitigationactiontype_id"))
    private Set<MitigationActionTypeEntity> mitigationActionType;

    // entity fields getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // entity relations getters and setters
    public Set<TrafficIncidentEntity> getTrafficIncident() {
        return trafficIncident;
    }

    public void setTrafficIncident(Set<TrafficIncidentEntity> trafficIncident) {
        this.trafficIncident = trafficIncident;
    }

    public Set<MitigationActionTypeEntity> getMitigationActionType() {
        return mitigationActionType;
    }

    public void setMitigationActionType(Set<MitigationActionTypeEntity> mitigationActionType) {
        this.mitigationActionType = mitigationActionType;
    }

}
