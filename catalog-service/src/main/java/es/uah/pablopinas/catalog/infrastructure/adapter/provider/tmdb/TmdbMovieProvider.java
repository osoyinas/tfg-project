package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.*;
import info.movito.themoviedbapi.model.core.Movie;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class TmdbMovieProvider implements ExternalProviderStrategy {

    private final TmdbBasicSearch apiSearch;

    public final String SOURCE_NAME = "TMDB";

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.MOVIE;
    }

    @Override
    public Optional<CatalogItem> fetchItem(CatalogSearchFilter filter) {
        try {
            MovieResultsPage moviesPage = apiSearch
                    .searchMovie(filter.getTitleContains(), 0);

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

    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        return null;
    }

    private Optional<CatalogItem> mapToCatalogItem(Movie movie) {
        if (movie == null) {
            return Optional.empty();
        }

        CatalogItem item = CatalogItem.builder()
                .title(movie.getTitle())
                .type(CatalogType.MOVIE)
                .releaseDate(movie.getReleaseDate() != null ? LocalDate.parse(movie.getReleaseDate()) : null)
                .externalSource(getExternalSourceInfoFrom(movie.getId()))
//                .genres(movie.getGenreIds() != null ? movie.getGenres().stream().map(Genre::getName).collect(Collectors.toList()) : List.of())
//                .creators()
                .build();

        return Optional.of(item);
    }

    private ExternalSourceInfo getExternalSourceInfoFrom(int id) {
        return new ExternalSourceInfo(SOURCE_NAME, String.valueOf(id));
    }
}
