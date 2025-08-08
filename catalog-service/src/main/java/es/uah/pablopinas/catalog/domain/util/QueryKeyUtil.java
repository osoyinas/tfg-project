package es.uah.pablopinas.catalog.domain.util;

import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.model.Pagination;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility class for building unique and deterministic query keys
 * for catalog search and trending/recommended content.
 */
public class QueryKeyUtil {

    /**
     * Builds a hashed key for a search query based on filters and pagination.
     * Used for identifying cached search results.
     */
    public static String buildKey(CatalogSearchFilter filter, Pagination pagination) {
        if (filter == null || filter.isEmpty()) {
            return "empty"; // fallback key if no filters are applied
        }
        String raw = buildRawKey(filter, pagination);
        return sha256(raw);
    }

    /**
     * Builds a raw (readable) key for a search query using all available fields.
     */
    public static String buildRawKey(CatalogSearchFilter filter, Pagination pagination) {
        String raw = String.format("title=%s|type=%s|genre=%s|year=%s|page=%d|size=%d",
                nullToEmpty(filter.getTitleContains()),
                nullToEmpty(filter.getType() != null ? filter.getType().name() : null),
                nullToEmpty(filter.getGenre()),
                filter.getReleaseYear() != null ? filter.getReleaseYear().toString() : "",
                pagination != null ? pagination.getPage() : 0,
                pagination != null ? pagination.getSize() : 0);
        return raw;
    }

    /**
     * Builds a raw, readable query key for trending items (e.g. TRENDING_MOVIE_1_20).
     */
    public static String buildTrendingKey(CatalogType type, Pagination pagination) {
        return buildTrendingKey(type, pagination.getPage(), pagination.getSize());
    }

    /**
     * Builds a trending query key given type, page number and page size.
     *
     * @param type the catalog content type
     * @param page the page number
     * @param size the page size
     * @return a deterministic string key
     */
    public static String buildTrendingKey(CatalogType type, int page, int size) {
        return String.format("TRENDING_%s_%d_%d", type.name(), page, size);
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
