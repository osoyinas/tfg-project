package es.uah.pablopinas.catalog.domain.model;


import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class QueryKeyUtil {

    public static String buildKey(CatalogSearchFilter filter) {
        String raw = String.format(
                "title=%s|type=%s|genre=%s|year=%s",
                nullToEmpty(filter.getTitleContains()),
                nullToEmpty(filter.getType() != null ? filter.getType().name() : null),
                nullToEmpty(filter.getGenre()),
                filter.getReleaseYear() != null ? filter.getReleaseYear().toString() : ""
        );

        return sha256(raw);
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
            return sb.toString(); // puedes cortar a los primeros 16-32 chars si quieres
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
