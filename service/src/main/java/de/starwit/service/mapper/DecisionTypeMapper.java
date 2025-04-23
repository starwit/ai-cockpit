package de.starwit.service.mapper;

import org.modelmapper.ModelMapper;

import de.starwit.aic.model.DecisionType;
import de.starwit.persistence.entity.DecisionTypeEntity;

public class DecisionTypeMapper implements Mapper<DecisionType, DecisionTypeEntity> {

    ModelMapper modelMapper = new ModelMapper();

    public DecisionTypeMapper() {
        modelMapper.addConverter(new ZonedToOffsetDateTimeConverter());
        modelMapper.addConverter(new OffsetToZonedDateTimeConverter());
        modelMapper.getConfiguration().setSkipNullEnabled(true);
    }

    @Override
    public DecisionType toDto(DecisionTypeEntity entity) {
        DecisionType dto = modelMapper.map(entity, DecisionType.class);
        return dto;
    }

    @Override
    public DecisionTypeEntity toEntity(DecisionType dto) {
        DecisionTypeEntity entity = modelMapper.map(dto, DecisionTypeEntity.class);
        return entity;
    }

}
