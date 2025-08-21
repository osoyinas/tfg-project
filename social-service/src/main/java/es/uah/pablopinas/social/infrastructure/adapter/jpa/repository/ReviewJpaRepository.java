package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Review;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewJpaRepository extends JpaRepository<Review, String> {
    long countByUserId(String userId);
    boolean existsByUserIdAndCatalogItemId(String userId, String catalogItemId);
    List<Review> findByUserId(String userId, PageRequest page);
    List<Review> findByCatalogItemId(String catalogItemId, PageRequest page);
    List<Review> findByUserIdAndRatingIsNotNull(String userId, PageRequest page);
    List<Review> findByUserIdAndTextIsNotNull(String userId, PageRequest page);
    List<Review> findByCatalogItemIdAndRatingIsNotNull(String catalogItemId, PageRequest page);
    List<Review> findByCatalogItemIdAndTextIsNotNull(String catalogItemId, PageRequest page);
    List<Review> findByUserIdAndCatalogItemId(String userId, String catalogItemId, PageRequest page);
    List<Review> findByUserIdAndCatalogItemIdAndRatingIsNotNull(String userId, String catalogItemId, PageRequest page);
    List<Review> findByUserIdAndCatalogItemIdAndTextIsNotNull(String userId, String catalogItemId, PageRequest page);
}
