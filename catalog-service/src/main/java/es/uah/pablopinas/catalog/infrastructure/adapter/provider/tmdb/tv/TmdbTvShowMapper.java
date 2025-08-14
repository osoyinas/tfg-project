package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.tv;

import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.GenresProvider;
import info.movito.themoviedbapi.model.core.TvSeries;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@RequiredArgsConstructor
@Component
public class TmdbTvShowMapper {

    public static final String SOURCE_NAME = "TMDB";
    private static final String TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
    private static final String POSTER_SIZE = "w500";
    private static final String COVER_SIZE = "w1280";

    private final GenresProvider genresProvider;

    public CatalogItem toDomain(TvSeries tvSeries) {
        return CatalogItem.builder()
                .title(tvSeries.getName())
                .description(tvSeries.getOverview())
                .rating(tvSeries.getVoteAverage() != null ? tvSeries.getVoteAverage() : 0.0)
                .ratingCount(tvSeries.getVoteCount() != null ? tvSeries.getVoteCount() : 0)
                .type(CatalogType.TV_SERIE)
                .releaseDate(parseReleaseDate(tvSeries.getFirstAirDate()))
                .genres(genresProvider.getGenres(tvSeries))
                .externalSource(getExternalSourceInfoFrom(tvSeries.getId()))
                .images(getImageSetFrom(tvSeries))
                .build();
    }

    private ExternalSourceInfo getExternalSourceInfoFrom(int tmdbId) {
        return ExternalSourceInfo.builder()
                .sourceName(SOURCE_NAME)
                .externalId(String.valueOf(tmdbId))
                .externalUrl("https://www.themoviedb.org/tv/" + tmdbId)
                .build();
    }

    private ImageSet getImageSetFrom(TvSeries tvSeries) {
        return ImageSet.builder()
                .poster(new Image(getImageUrl(tvSeries.getPosterPath(), POSTER_SIZE),
                        "Poster for " + tvSeries.getName()))
                .cover(new Image(getImageUrl(tvSeries.getBackdropPath(), COVER_SIZE),
                        "Cover for " + tvSeries.getName()))
                .build();
    }

    private String getImageUrl(String path, String size) {
        if (path == null || path.isEmpty()) return null;
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
