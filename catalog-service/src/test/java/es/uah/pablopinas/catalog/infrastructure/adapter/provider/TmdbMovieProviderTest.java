package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.TmdbSearch;
import info.movito.themoviedbapi.model.core.Movie;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.tools.TmdbException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class TmdbMovieProviderTest {

    @InjectMocks
    private TmdbMovieProvider provider;

    @Mock
    private TmdbApi tmdbApi;
    @Mock
    private TmdbSearch tmdbSearch;
    @Mock
    private TmdbMovies tmdbMovies;
    @Mock
    private MovieResultsPage movieResultsPage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(tmdbApi.getSearch()).thenReturn(tmdbSearch);
        when(tmdbApi.getMovies()).thenReturn(tmdbMovies);
        provider = new TmdbMovieProvider("fake-key", tmdbApi);
    }

    @Test
    void supportsMovieType() {
        assertTrue(provider.supports(CatalogType.MOVIE));
        assertFalse(provider.supports(CatalogType.BOOK));
    }

    @Test
    void fetchReturnsCatalogItemWhenMovieFound() throws TmdbException {
        Movie movie = mock(Movie.class);
        when(movie.getId()).thenReturn(603); // id de Matrix en TMDB
        when(movie.getTitle()).thenReturn("Matrix");
        when(movie.getReleaseDate()).thenReturn("1999-03-31");
        when(movie.getOverview()).thenReturn("A computer hacker learns about the true nature of reality and his role in the war against its controllers.");
        when(movie.getPosterPath()).thenReturn("/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg");
        when(tmdbSearch.searchMovie(anyString(), anyBoolean(), anyString(), anyString(), anyInt(), anyString(), anyString())).thenReturn(movieResultsPage);
        when(movieResultsPage.getResults()).thenReturn(List.of(movie));
        Optional<CatalogItem> result = provider.fetch("Matrix");
        assertTrue(result.isPresent(), "El resultado debe estar presente si el Movie tiene id");
        CatalogItem item = result.get();
        assertEquals("Matrix", item.getTitle());
        assertEquals(CatalogType.MOVIE, item.getType());
        assertEquals(LocalDate.of(1999, 3, 31), item.getReleaseDate());
    }

    @Test
    void fetchReturnsEmptyWhenNoMovieFound() throws Exception {
        when(tmdbApi.getMovies()).thenReturn(tmdbMovies);
        when(tmdbApi.getSearch().searchMovie(anyString(), anyBoolean(), anyString(), anyString(), anyInt(), anyString(), anyString())).thenReturn(movieResultsPage);
        when(movieResultsPage.getResults()).thenReturn(List.of());

        TmdbMovieProvider provider = new TmdbMovieProvider("fake-key", tmdbApi);

        Optional<CatalogItem> result = provider.fetch("NoExiste");
        assertTrue(result.isEmpty());
    }

    @Test
    void fetchHandlesException() {
        when(tmdbApi.getMovies()).thenThrow(new RuntimeException("Error"));

        TmdbMovieProvider provider = new TmdbMovieProvider("fake-key", tmdbApi);

        Optional<CatalogItem> result = provider.fetch("Error");
        assertTrue(result.isEmpty());
    }
}
