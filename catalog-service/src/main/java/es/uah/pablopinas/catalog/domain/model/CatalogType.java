package es.uah.pablopinas.catalog.domain.model;

public enum CatalogType {
    BOOK,
    MOVIE,
    TV_SERIE;

    public static CatalogType fromString(String type) {
        switch (type.toUpperCase()) {
            case "BOOK":
                return BOOK;
            case "MOVIE":
                return MOVIE;
            case "TV_SERIE":
                return TV_SERIE;
            default:
                throw new IllegalArgumentException("Unknown catalog type: " + type);
        }
    }

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
