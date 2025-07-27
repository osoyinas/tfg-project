package es.uah.pablopinas.catalog.infrastructure.config;

import es.uah.pablopinas.catalog.domain.model.CatalogType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class CatalogTypeConverter implements Converter<String, CatalogType> {

    @Override
    public CatalogType convert(String source) {
        return CatalogType.fromString(source);
    }
}
