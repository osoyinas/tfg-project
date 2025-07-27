package es.uah.pablopinas.catalog.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Information about the external source of a catalog item (e.g. TMDB, IMDB, etc.)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalSourceInfo {
    /**
     * Name of the external source (e.g. TMDB, IMDB)
     */
    private String sourceName;

    /**
     * External ID in the source system
     */
    private String externalId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExternalSourceInfo that)) return false;
        if (!sourceName.equals(that.sourceName)) return false;
        return externalId.equals(that.externalId);
    }
}

