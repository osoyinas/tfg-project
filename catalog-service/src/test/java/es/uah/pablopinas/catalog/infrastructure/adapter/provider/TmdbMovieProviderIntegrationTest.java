package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.GenresProvider;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbMovieProvider;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Real integration test against the TMDB API. Requires a valid API key in application.yml.
 */
@SpringBootTest
@Disabled("Run manually only with valid API key and internet connection")
class TmdbMovieProviderIntegrationTest {

    @Autowired
    @Qualifier("tmdbMovieProvider")
    private TmdbMovieProvider tmdbMovieProvider;

    @Autowired
    private GenresProvider genresProvider;

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(TmdbMovieProviderIntegrationTest.class);

    @Test
    void fetchRealMovieFromApi() {
        PageResult<CatalogItem> result = tmdbMovieProvider.fetch(CatalogSearchFilter
                .builder()
                .titleContains("Matrix")
                .type(CatalogType.MOVIE)
                .build(), new Pagination(0, 1));
        assertTrue(!result.isEmpty(), "Should find the movie Matrix in TMDB");
        CatalogItem item = result.items().get(0);
        assertEquals("Matrix", item.getTitle());
        assertEquals(CatalogType.MOVIE, item.getType());
        assertNotNull(item.getReleaseDate());
    }

    @Test
    void checkGenresFetch() {
        var genres = genresProvider.getGenreCache();
        assertNotNull(genres, "Genres should not be null");
        assertFalse(genres.isEmpty(), "Genres should not be empty");
        log.info("Available genres: {}", genres);
    }
}
