package de.starwit.service.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface Mapper<DTO, ENTITY> {

    public DTO toDto(ENTITY entity);

    public ENTITY toEntity(DTO dto);

    public default List<DTO> toDtoList(List<ENTITY> entities) {
        List<DTO> dtos = entities.stream()
                .map(entity -> toDto(entity))
                .collect(Collectors.toList());
        return dtos;

    }

    public default List<ENTITY> toEntityList(List<DTO> dtos) {
        List<ENTITY> entities = dtos.stream()
                .map(dto -> toEntity(dto))
                .collect(Collectors.toList());
        return entities;

    }

    public default Set<DTO> toDtoSet(Set<ENTITY> entities) {
        Set<DTO> dtos = entities.stream()
                .map(entity -> toDto(entity))
                .collect(Collectors.toSet());
        return dtos;

    }

    public default Set<ENTITY> toEntityList(Set<DTO> dtos) {
        Set<ENTITY> entities = dtos.stream()
                .map(dto -> toEntity(dto))
                .collect(Collectors.toSet());
        return entities;

    }

}
