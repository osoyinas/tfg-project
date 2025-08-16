package es.uah.pablopinas.catalog.domain.model;

import es.uah.pablopinas.catalog.domain.model.details.CatalogItemDetails;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Getter
@Setter
@NoArgsConstructor

@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Builder
public class CatalogItem {
    private String id;
    private String title;
    private String originalTitle;
    private String description;
    @NonNull
    private CatalogType type;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private Double rating;
    private Integer ratingCount;

    private LocalDate releaseDate;
    private List<String> genres;
    private List<String> creators;
    private ImageSet images;
    private ExternalSourceInfo externalSource;
    private boolean isRelevant;
    private LocalDateTime relevantUntil;
    private CatalogItemDetails details;

    @Builder.Default
    private List<String> q = new ArrayList<>();

    /**
     * Normalize a string for search purposes:
     * <ul>
     *   <li>Converts to lowercase</li>
     *   <li>Removes accents and diacritics</li>
     *   <li>Removes punctuation</li>
     *   <li>Collapses multiple spaces into one</li>
     * </ul>
     *
     * @param s the raw input string
     * @return normalized string, or null if input was null
     */
    public static String normalize(String s) {
        if (s == null) return null;
        String lower = s.toLowerCase(Locale.ROOT).trim();
        String noAccents = java.text.Normalizer.normalize(lower, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return noAccents.replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /**
     * Records a new query hit for this item.
     * The query is normalized before being added.
     * Duplicate queries are ignored.
     * The list can be capped to avoid unlimited growth.
     *
     * @param rawQuery the original user query string
     */
    public void recordQueryHit(String rawQuery) {
        String n = normalize(rawQuery);
        if (n != null && !n.isBlank() && (q == null || !q.contains(n))) {
            if (q == null) q = new ArrayList<>();
            q.add(n);
            // Optional: cap size to avoid unbounded growth
            if (q.size() > 50) q.remove(0);
        }
    }

}
