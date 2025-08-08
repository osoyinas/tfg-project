package es.uah.pablopinas.catalog.application.port.in;

public interface RateCatalogItemUseCase {
    /**
     * Rates a catalog item with a given rating.
     *
     * @param catalogItemId the ID of the catalog item to rate
     * @param rating        the rating to assign to the catalog item, must be between 0.0 and 10.0
     */
    void rateCatalogItem(String catalogItemId, Double rating);
}
