package de.starwit.persistence.entity;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.converter.StringMapConverter;
import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

/**
 * Module Entity class
 */
@Entity
@Table(name = "module")
public class ModuleEntity extends AbstractEntity<Long> {

    @Column(name = "description")
    private String description;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "version")
    private String version;

    @Column(name = "application_identifier")
    private String applicationIdentifier;

    @Column(name = "use_ai")
    private boolean useAI;

    @Column(name = "model_name")
    private String modelName;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "last_deployment")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime lastDeployment;

    @Enumerated(EnumType.STRING)
    @Column(name = "model_type")
    private ModelType modelType;

    @Column(name = "model_link")
    private String modelLink;

    @Column(name = "public_training_data")
    private boolean publicTrainingData = false;

    @Column(name = "link_to_public_training_data")
    private String linkToPublicTrainingData;

    @Column(name = "sbom_locations")
    @Convert(converter = StringMapConverter.class)
    private Map<String, String> sbomlocations;

    @JsonIgnore
    @OneToMany(mappedBy = "module", cascade = { CascadeType.ALL })
    private Set<DecisionEntity> decision;

    @JsonManagedReference
    @OneToMany(mappedBy = "module", cascade = { CascadeType.ALL })
    private Set<DecisionTypeEntity> decisionType;

    @JsonManagedReference
    @OneToMany(mappedBy = "module", cascade = { CascadeType.ALL })
    private Set<ActionTypeEntity> actionType;

    @JsonFilter("filterIdName")
    @ManyToMany
    @JoinTable(name = "module_successors", joinColumns = @JoinColumn(name = "predecessor_id"), inverseJoinColumns = @JoinColumn(name = "successor_id"))
    private Set<ModuleEntity> successors = new HashSet<>();

    @Transient
    private int openDecisions;

    @Transient
    private int madeDecisions;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<DecisionEntity> getDecision() {
        return decision;
    }

    public void setDecision(Set<DecisionEntity> decision) {
        this.decision = decision;
    }

    public Set<DecisionTypeEntity> getDecisionType() {
        return decisionType;
    }

    public void setDecisionType(Set<DecisionTypeEntity> decisionType) {
        this.decisionType = decisionType;
    }

    public Set<ActionTypeEntity> getActionType() {
        return actionType;
    }

    public void setActionType(Set<ActionTypeEntity> actionType) {
        this.actionType = actionType;
    }

    public boolean isUseAI() {
        return useAI;
    }

    public void setUseAI(boolean useAI) {
        this.useAI = useAI;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public ModelType getModelType() {
        return modelType;
    }

    public void setModelType(ModelType modelType) {
        this.modelType = modelType;
    }

    public String getModelLink() {
        return modelLink;
    }

    public void setModelLink(String modeLink) {
        this.modelLink = modeLink;
    }

    public boolean isPublicTrainingData() {
        return publicTrainingData;
    }

    public void setPublicTrainingData(boolean publicTrainingData) {
        this.publicTrainingData = publicTrainingData;
    }

    public String getLinkToPublicTrainingData() {
        return linkToPublicTrainingData;
    }

    public void setLinkToPublicTrainingData(String linkToPublicTrainingData) {
        this.linkToPublicTrainingData = linkToPublicTrainingData;
    }

    public Map<String, String> getSbomlocations() {
        return sbomlocations;
    }

    public void setSbomlocations(Map<String, String> sbomlocations) {
        this.sbomlocations = sbomlocations;
    }

    public Set<ModuleEntity> getSuccessors() {
        return successors;
    }

    public void setSuccessors(Set<ModuleEntity> successors) {
        this.successors = successors;
    }

    public ZonedDateTime getLastDeployment() {
        return lastDeployment;
    }

    public void setLastDeployment(ZonedDateTime lastDeployment) {
        this.lastDeployment = lastDeployment;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getApplicationIdentifier() {
        return applicationIdentifier;
    }

    public void setApplicationIdentifier(String applicationIdentifier) {
        this.applicationIdentifier = applicationIdentifier;
    }

    public int getOpenDecisions() {
        return openDecisions;
    }

    public void setOpenDecisions(int openDecisions) {
        this.openDecisions = openDecisions;
    }

    public int getMadeDecisions() {
        return madeDecisions;
    }

    public void setMadeDecisions(int madeDecisions) {
        this.madeDecisions = madeDecisions;
    }

    @Override
    public String toString() {
        return "ModuleEntity [description=" + description + ", name=" + name + ", version=" + version
                + ", applicationIdentifier=" + applicationIdentifier + ", useAI=" + useAI + ", modelName=" + modelName
                + ", modelVersion=" + modelVersion + ", lastDeployment=" + lastDeployment + ", modelType=" + modelType
                + ", modelLink=" + modelLink + ", publicTrainingData=" + publicTrainingData
                + ", linkToPublicTrainingData=" + linkToPublicTrainingData + ", sbomlocations=" + sbomlocations
                + ", decision=" + decision + ", decisionType=" + decisionType + ", actionType=" + actionType
                + ", successors=" + successors + "]";
    }
}
