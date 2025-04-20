package de.starwit.service.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;

import de.starwit.aic.model.Decision;
import de.starwit.persistence.entity.DecisionEntity;

public class DecisionMapper {

    ModelMapper modelMapper = new ModelMapper();

    public DecisionMapper() {
        modelMapper.addConverter(new ZonedToOffsetDateTimeConverter());
        modelMapper.addConverter(new OffsetToZonedDateTimeConverter());

        modelMapper.typeMap(DecisionEntity.class, Decision.class)
                .addMappings(mapper -> mapper.map(DecisionEntity::getAction, Decision::setActions));
        modelMapper.typeMap(Decision.class, DecisionEntity.class)
                .addMappings(mapper -> mapper.map(Decision::getActions, DecisionEntity::setAction));

        modelMapper.getConfiguration().setSkipNullEnabled(true);
    }

    public Decision toDto(DecisionEntity entity) {
        Decision dto = modelMapper.map(entity, Decision.class);
        return dto;
    }

    public DecisionEntity toEntity(Decision dto) {
        DecisionEntity entity = modelMapper.map(dto, DecisionEntity.class);
        return entity;
    }

    public List<Decision> toDtoList(List<DecisionEntity> entities) {
        List<Decision> dtos = entities.stream()
                .map(entity -> toDto(entity))
                .collect(Collectors.toList());
        return dtos;

    }

    public List<DecisionEntity> toEntityList(List<Decision> dtos) {
        List<DecisionEntity> entities = dtos.stream()
                .map(dto -> toEntity(dto))
                .collect(Collectors.toList());
        return entities;

    }

}
