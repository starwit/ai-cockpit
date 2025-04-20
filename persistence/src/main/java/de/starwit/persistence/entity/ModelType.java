package de.starwit.persistence.entity;

/**
 * AI model type
 */
public enum ModelType {
    LLM, // Large Language Model
    VLM, // Vision Language Model
    EMBEDDING, // Embedding Model
    MULTIMODAL, // Multimodal Model
    CNN, // Convolutional Neural Network Model
    COMPUTERVISION, // Computer Vision Model
    RULEBASED, // Rule-based Engine
    MISC; // Other Model Type

    public static ModelType fromValue(String value) {
        for (ModelType type : ModelType.values()) {
            if (type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid ModelType value: " + value);
    }
}
