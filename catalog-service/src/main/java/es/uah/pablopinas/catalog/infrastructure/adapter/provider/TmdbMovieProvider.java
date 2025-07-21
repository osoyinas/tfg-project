package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class TmdbMovieProvider implements ExternalProviderStrategy {

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.MOVIE;
    }

    @Override
    public Optional<CatalogItem> fetch(String title) {
        // TODO: implementar llamada real a TMDB
        log.info("Simulando consulta a TMDB para película: {}", title);

        return Optional.of(
                CatalogItem.builder()
                        .title(title)
                        .type(CatalogType.MOVIE)
                        .releaseYear(1999)
                        .genres(List.of("Sci-Fi", "Action"))
                        .creators(List.of("Lana Wachowski", "Lilly Wachowski"))
                        .averageRating(4.5)
                        .build()
        );
    }
}
