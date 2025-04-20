package de.starwit.service.mapper;

import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class ZonedToOffsetDateTimeConverter extends AbstractConverter<ZonedDateTime, OffsetDateTime> {

    @Override
    public OffsetDateTime convert(ZonedDateTime zoned) {
        return zoned != null ? zoned.toOffsetDateTime() : null;
    }
}
