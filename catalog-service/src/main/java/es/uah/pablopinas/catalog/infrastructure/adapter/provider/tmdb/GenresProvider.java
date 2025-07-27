package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import info.movito.themoviedbapi.TmdbGenre;
import info.movito.themoviedbapi.model.core.Genre;
import info.movito.themoviedbapi.model.core.Movie;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class GenresProvider {

    private final TmdbGenre tmdbGenre;
    private final Map<Integer, String> genreCache = new ConcurrentHashMap<>();
    public final static String UNKNOWN_GENRE = "Unknown";

    @PostConstruct
    public void init() {
        refreshGenres();
    }

    @Scheduled(fixedRate = 60 * 60 * 1000) // every hour
    public void refreshGenres() {
        try {
            List<Genre> apiGenres = tmdbGenre.getMovieList(TmdbConfig.LANGUAGE);
            genreCache.clear();
            apiGenres.forEach(g -> genreCache.put(g.getId(), g.getName()));
        } catch (Exception ignored) {
        }
    }

    public String getGenreName(int genreId) {
        return genreCache.getOrDefault(genreId, UNKNOWN_GENRE);
    }

    public List<String> getGenreNames(List<Integer> genreIds) {
        return genreIds.stream().map(this::getGenreName).toList();
    }

    public List<String> getGenres(Movie movie) {
        try {
            List<Integer> genresIds = movie.getGenreIds();
            return getGenreNames(genresIds);
        } catch (Exception e) {
            return List.of();
        }
    }

    public Map<Integer, String> getGenreCache() {
        return genreCache;
    }
}
