package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = BookDetailsDocument.class, name = "book"),
        @JsonSubTypes.Type(value = MovieDetailsDocument.class, name = "movie"),
        @JsonSubTypes.Type(value = TvShowDetailsDocument.class, name = "tv_show")
})
@Data
public abstract class CatalogItemDetailsDocument {
}
