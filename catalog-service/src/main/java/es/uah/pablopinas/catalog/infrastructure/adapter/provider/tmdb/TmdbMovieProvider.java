package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbTrending;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.tools.model.time.TimeWindow;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component("tmdbMovieProvider")
@RequiredArgsConstructor
public class TmdbMovieProvider implements ExternalProviderStrategy {

    private final TmdbBasicSearch apiSearch;
    private final MovieMapper movieMapper;
    private final TmdbApi tmdbApi;

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.MOVIE;
    }

    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        try {
            MovieResultsPage moviesPage = apiSearch
                    .searchMovie(filter.getTitleContains(), pagination.getPage());
            if (moviesPage == null || moviesPage.getResults() == null) {
                log.warn("No movies found for filter: {}", filter);
                return PageResult.empty(pagination);
            }
            var items = moviesPage.getResults().stream()
                    .map(movie -> movieMapper.toDomain(movie))
                    .toList();
            return new PageResult<>(items,
                    pagination.getPage(),
                    pagination.getSize(),
                    moviesPage.getTotalResults(),
                    moviesPage.getTotalPages());
        } catch (Exception e) {
            log.error("Error while fetching TMDB items: {}", e.getMessage());
            return PageResult.empty(pagination);
        }
    }

    @Override
    public PageResult<CatalogItem> fetchTrending(Pagination pagination) {
        TmdbTrending tmdbTrending = tmdbApi.getTrending();
        try {

            MovieResultsPage resultsPage = tmdbTrending.getMovies(
                    TimeWindow.WEEK,
                    TmdbConfig.LANGUAGE,
                    pagination.getPage() + 1 // TMDB uses 1-based indexing for pages
            );

            var items = resultsPage.getResults()
                    .stream()
                    .map(movie -> movieMapper.toDomain(movie))
                    .toList();
            return new PageResult<>(items, pagination.getPage(), 20, resultsPage.getTotalResults(),
                    resultsPage.getTotalPages());
        } catch (Exception e) {
            log.error("Error while fetching trending items from TMDB: {}", e.getMessage());
            return PageResult.empty(pagination);
        }
    }

}
