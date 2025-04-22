package de.starwit.service.mapper;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class OffsetToZonedDateTimeConverter extends AbstractConverter<OffsetDateTime, ZonedDateTime> {

    @Override
    public ZonedDateTime convert(OffsetDateTime offset) {
        return offset != null ? offset.atZoneSameInstant(ZoneId.systemDefault()) : null;
    }
}
