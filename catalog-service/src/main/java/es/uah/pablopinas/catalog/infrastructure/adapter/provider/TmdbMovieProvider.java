package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.core.Movie;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class TmdbMovieProvider implements ExternalProviderStrategy {

    @Value("${tmdb.api-key}")
    private String apiKey;

    private TmdbApi tmdbApi;

    public TmdbMovieProvider(@Value("${tmdb.api-key}") String apiKey, TmdbApi tmdbApi) {
        this.apiKey = apiKey;
        this.tmdbApi = tmdbApi;
    }

    // Constructor para Spring (sin TmdbApi, crea uno por defecto)
    public TmdbMovieProvider() {
    }

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.MOVIE;
    }

    @Override
    public Optional<CatalogItem> fetch(String title) {
        try {
            TmdbApi api = tmdbApi != null ? tmdbApi : new TmdbApi(apiKey);
            MovieResultsPage moviesPage = api.getSearch()
                    .searchMovie(title, true, "es-ES", "1500", 1, "", "");

            List<CatalogItem> items = moviesPage.getResults().stream()
                    .map(movie -> mapToCatalogItem(movie).orElse(null))
                    .filter(item -> item != null)
                    .toList();

            return items.isEmpty() ? Optional.empty() : Optional.of(items.get(0));
        } catch (Exception e) {
            log.error("Error while fetching TMDB: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<CatalogItem> mapToCatalogItem(Movie movie) {
        if (movie == null) {
            return Optional.empty();
        }

        CatalogItem item = CatalogItem.builder()
                .title(movie.getTitle())
                .type(CatalogType.MOVIE)
                .releaseDate(movie.getReleaseDate() != null ? LocalDate.parse(movie.getReleaseDate()) : null)
//                .genres(movie.getGenreIds() != null ? movie.getGenres().stream().map(Genre::getName).collect(Collectors.toList()) : List.of())
//                .creators()
                .build();

        return Optional.of(item);
    }
}
