package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import es.uah.pablopinas.catalog.domain.model.*;
import info.movito.themoviedbapi.model.core.Movie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@RequiredArgsConstructor
@Component
public class TmdbMovieMapper {

    public static final String SOURCE_NAME = "TMDB";
    private static final String TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
    private static final String POSTER_SIZE = "w500";
    private static final String COVER_SIZE = "w1280";

    private final GenresProvider genresProvider;

    public CatalogItem toDomain(Movie movie) {
        return CatalogItem.builder()
                .title(movie.getTitle())
                .description(movie.getOverview())
                .type(CatalogType.MOVIE)
                .releaseDate(parseReleaseDate(movie.getReleaseDate()))
                .genres(genresProvider.getGenres(movie))
                .externalSource(getExternalSourceInfoFrom(movie.getId()))
                .images(getImageSetFrom(movie))
                .build();
    }

    private ExternalSourceInfo getExternalSourceInfoFrom(int tmdbId) {
        return ExternalSourceInfo.builder()
                .sourceName(SOURCE_NAME)
                .externalId(String.valueOf(tmdbId))
                .build();
    }

    private ImageSet getImageSetFrom(Movie movie) {
        return ImageSet.builder()
                .poster(new Image(getImageUrl(movie.getPosterPath(), POSTER_SIZE),
                        "Poster for " + movie.getTitle()))
                .cover(new Image(getImageUrl(movie.getBackdropPath(), COVER_SIZE),
                        "Cover for " + movie.getTitle()))
                .build();
    }

    private String getImageUrl(String path, String size) {
        if (path == null || path.isEmpty()) {
            return null;
        }
        return TMDB_IMAGE_BASE_URL + size + path;
    }

    private LocalDate parseReleaseDate(String releaseDate) {
        try {
            return releaseDate != null ? LocalDate.parse(releaseDate) : null;
        } catch (Exception e) {
            return null;
        }
    }

}