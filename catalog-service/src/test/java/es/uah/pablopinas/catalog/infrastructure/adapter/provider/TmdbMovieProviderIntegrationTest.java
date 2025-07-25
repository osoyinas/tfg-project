package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbSearch;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.tools.TmdbException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Real integration test against the TMDB API. Requires a valid API key in application.yml.
 */
@SpringBootTest
@Disabled("Run manually only with valid API key and internet connection")
class TmdbMovieProviderIntegrationTest {

    @Value("${tmdb.api-key}")
    private String apiKey;

    @Test
    void fetchRealMovieFromApi() {
        TmdbApi tmdbApi = new TmdbApi(apiKey);
        TmdbMovieProvider provider = new TmdbMovieProvider(apiKey, tmdbApi);
        Optional<CatalogItem> result = provider.fetch("Matrix");
        assertTrue(result.isPresent(), "Should find the movie Matrix in TMDB");
        CatalogItem item = result.get();
        assertEquals("Matrix", item.getTitle());
        assertEquals(CatalogType.MOVIE, item.getType());
        assertNotNull(item.getReleaseDate());
    }

    @Test
    void tmdbApiSearchReturnsResults() throws TmdbException {
        TmdbApi tmdbApi = new TmdbApi(apiKey);
        TmdbSearch search = tmdbApi.getSearch();
        MovieResultsPage page = search.searchMovie("Matrix", null, "US", null, null, null, null);
        assertNotNull(page);
        assertFalse(page.getResults().isEmpty(), "Search should return results");
    }
}
