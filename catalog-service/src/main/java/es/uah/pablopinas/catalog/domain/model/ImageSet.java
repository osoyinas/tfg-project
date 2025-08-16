package es.uah.pablopinas.catalog.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ImageSet {
    /**
     * Poster image (portrait orientation).
     * <p>
     * Typical aspect ratio: 2:3 (e.g., 500x750 px).
     * Recommended for: movie/series posters, book covers in detail views.
     * File size: ~100–300 KB (medium resolution).
     */
    Image poster;

    /**
     * Cover image (landscape orientation).
     * <p>
     * Typical aspect ratio: 16:9 (e.g., 1280x720 px or 1920x1080 px).
     * Recommended for: wide headers, backgrounds, hero sections.
     * File size: ~200–500 KB (depending on resolution).
     */
    Image cover;

    /**
     * Thumbnail image (square or cropped).
     * <p>
     * Typical size: 100x100 – 300x300 px.
     * Recommended for: list items, search results, small previews.
     * File size: ~10–50 KB (lightweight).
     */
    Image thumbnail;
}
