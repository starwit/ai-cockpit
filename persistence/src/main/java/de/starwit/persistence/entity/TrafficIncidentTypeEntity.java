package de.starwit.persistence.entity;

import com.fasterxml.jackson.annotation.JsonFilter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Set;

import java.time.ZonedDateTime;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.CascadeType;

/**
 * TrafficIncidentType Entity class
 */
@Entity
@Table(name = "trafficincidenttype")
public class TrafficIncidentTypeEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "name")
    private String name;


    // entity relations
    @JsonFilter("filterId")
    @OneToMany(mappedBy = "trafficIncidentType")
    private Set<TrafficIncidentEntity> trafficIncident;

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

}
