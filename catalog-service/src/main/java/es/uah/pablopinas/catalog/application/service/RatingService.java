package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.RateCatalogItemUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.exception.CatalogItemNotFoundException;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService implements RateCatalogItemUseCase {

    private final CatalogItemRepositoryPort catalogRepository;

    @Override
    public void rateCatalogItem(String catalogItemId, Double rating) {
        Optional<CatalogItem> optionalItem = catalogRepository.findById(catalogItemId);
        if (optionalItem.isEmpty()) {
            log.warn("Catalog item with ID '{}' not found for rating.", catalogItemId);
            throw new CatalogItemNotFoundException(catalogItemId);
        }
        log.info("Rating catalog item with ID '{}' with rating '{}'.", catalogItemId, rating);
        CatalogItem item = optionalItem.get();
        if (rating < 0.0 || rating > 10.0) {
            throw new IllegalArgumentException("Rating must be between 0.0 and 10.0");
        }
        Integer currentRatingCount = item.getRatingCount() == null ? 0 : item.getRatingCount();
        Double newRating = calculateRating(item, rating);
        item.setRating(newRating);
        item.setRatingCount(currentRatingCount + 1);

        catalogRepository.save(item);
    }

    private Double calculateRating(CatalogItem item, Double newRating) {
        Double currentRating = item.getRating();
        Integer currentRatingCount = item.getRatingCount();

        if (currentRating == null || currentRatingCount == null) {
            return newRating;
        } else {
            return ((currentRating * currentRatingCount) + newRating) / (currentRatingCount + 1);
        }
    }
}
