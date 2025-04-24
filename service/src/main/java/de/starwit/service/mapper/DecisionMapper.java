package de.starwit.service.mapper;

import org.modelmapper.ModelMapper;

import de.starwit.aic.model.Decision;
import de.starwit.persistence.entity.DecisionEntity;

public class DecisionMapper implements Mapper<Decision, DecisionEntity> {

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

    @Override
    public Decision toDto(DecisionEntity entity) {
        Decision dto = modelMapper.map(entity, Decision.class);
        return dto;
    }

    @Override
    public DecisionEntity toEntity(Decision dto) {
        DecisionEntity entity = modelMapper.map(dto, DecisionEntity.class);
        return entity;
    }

}
