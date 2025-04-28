package de.starwit.service.mapper;

import org.modelmapper.ModelMapper;

import de.starwit.aic.model.Module;
import de.starwit.persistence.entity.ModuleEntity;

public class ModuleMapper implements Mapper<Module, ModuleEntity> {

    ModelMapper modelMapper = new ModelMapper();

    public ModuleMapper() {
        modelMapper.addConverter(new EntityToModuleConverter());
        modelMapper.addConverter(new ModuleToEntityConverter());
        modelMapper.getConfiguration().setSkipNullEnabled(true);
    }

    @Override
    public Module toDto(ModuleEntity entity) {
        Module dto = modelMapper.map(entity, Module.class);
        return dto;
    }

    @Override
    public ModuleEntity toEntity(Module dto) {
        ModuleEntity entity = modelMapper.map(dto, ModuleEntity.class);
        return entity;
    }
}
