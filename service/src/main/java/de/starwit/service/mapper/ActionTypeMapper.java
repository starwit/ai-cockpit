package de.starwit.service.mapper;

import org.modelmapper.ModelMapper;

import de.starwit.aic.model.ActionType;
import de.starwit.persistence.entity.ActionTypeEntity;

public class ActionTypeMapper implements Mapper<ActionType, ActionTypeEntity> {

    ModelMapper modelMapper = new ModelMapper();

    public ActionTypeMapper() {
        modelMapper.addConverter(new ZonedToOffsetDateTimeConverter());
        modelMapper.addConverter(new OffsetToZonedDateTimeConverter());
        modelMapper.getConfiguration().setSkipNullEnabled(true);
    }

    @Override
    public ActionType toDto(ActionTypeEntity entity) {
        ActionType dto = modelMapper.map(entity, ActionType.class);
        return dto;
    }

    @Override
    public ActionTypeEntity toEntity(ActionType dto) {
        ActionTypeEntity entity = modelMapper.map(dto, ActionTypeEntity.class);
        return entity;
    }

}
