package es.uah.pablopinas.catalog.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

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

    private String externalUrl;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExternalSourceInfo that)) return false;
        if (!sourceName.equals(that.sourceName)) return false;
        return externalId.equals(that.externalId) &&
                (Objects.equals(externalUrl, that.externalUrl));
    }

    @Override
    public int hashCode() {
        int result = sourceName.hashCode();
        result = 31 * result + externalId.hashCode() + (externalUrl != null ? externalUrl.hashCode() : 0);
        return result;
    }
}

