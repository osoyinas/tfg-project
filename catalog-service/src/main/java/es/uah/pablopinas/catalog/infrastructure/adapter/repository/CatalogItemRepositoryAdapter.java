package es.uah.pablopinas.catalog.infrastructure.adapter.repository;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper.CatalogItemMapper;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogItemDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CatalogItemRepositoryAdapter implements CatalogItemRepositoryPort {

    private final SpringDataCatalogItemRepository repository;
    private final MongoTemplate mongoTemplate;

    @Override
    public CatalogItem save(CatalogItem item) {
        CatalogItemDocument saved = repository.save(CatalogItemMapper.toDocument(item));
        return CatalogItemMapper.toDomain(saved);
    }

    @Override
    public Boolean alreadyExists(CatalogItem item) {
        // Check if the item has an ID and if it exists in the repository
        if (item.getId() != null && !item.getId().isEmpty()) {
            if (repository.existsById(item.getId())) {
                return true;
            }
        }

        // Otherwise, check if external source is provided and if the item exists by external source
        if (item.getExternalSource() != null && item.getExternalSource().getSourceName() != null && item.getExternalSource().getExternalId() != null) {
            return repository.existsByExternalSource_SourceNameAndExternalSource_ExternalId(item.getExternalSource().getSourceName(), item.getExternalSource().getExternalId());
        }

        // If no ID or external source is provided, we cannot determine if it exists
        return false;
    }


    @Override
    public Optional<CatalogItem> findById(String id) {
        return repository.findById(id).map(CatalogItemMapper::toDomain);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public PageResult<CatalogItem> findAll(int page, int size) {
        org.springframework.data.domain.Page<CatalogItemDocument> result = repository.findAll(PageRequest.of(page, size));
        List<CatalogItem> items = result.getContent().stream().map(CatalogItemMapper::toDomain).collect(Collectors.toList());
        return PageResult.of(items, page, size);
    }

    @Override
    public PageResult<CatalogItem> search(CatalogSearchFilter filter, Pagination pagination) {
        Query query = new Query();

        if (filter.getTitleContains() != null) {
            query.addCriteria(Criteria.where("title").regex(".*" + filter.getTitleContains() + ".*", "i"));
        }
        if (filter.getType() != null) {
            query.addCriteria(Criteria.where("type").is(filter.getType().toString()));
        }
        if (filter.getIds() != null && !filter.getIds().isEmpty()) {
            query.addCriteria(Criteria.where("id").in(filter.getIds()));
        }
        // Filtros combinados para rating
        Criteria ratingCriteria = null;
        if (filter.getMinRating() != null || filter.getMaxRating() != null) {
            Criteria minMaxRatingCriteria = Criteria.where("rating");
            if (filter.getMinRating() != null) {
                minMaxRatingCriteria = minMaxRatingCriteria.gte(filter.getMinRating());
            }
            if (filter.getMaxRating() != null) {
                minMaxRatingCriteria = minMaxRatingCriteria.lte(filter.getMaxRating());
            }
            ratingCriteria = minMaxRatingCriteria;
        }
        if (ratingCriteria != null) {
            query.addCriteria(ratingCriteria);
        }
        Criteria genresCriteria = null;
        if (filter.getGenres() != null && !filter.getGenres().isEmpty()) {
            genresCriteria = Criteria.where("genres").in(filter.getGenres());
        }
        if (genresCriteria != null) {
            query.addCriteria(genresCriteria);
        }

        // Filtros combinados para minReleaseDate y maxReleaseDate
        Criteria releaseDateCriteria = null;
        if (filter.getMinReleaseDate() != null || filter.getMaxReleaseDate() != null) {
            Criteria minMaxReleaseDateCriteria = Criteria.where("releaseDate");
            if (filter.getMinReleaseDate() != null) {
                minMaxReleaseDateCriteria = minMaxReleaseDateCriteria.gte(filter.getMinReleaseDate());
            }
            if (filter.getMaxReleaseDate() != null) {
                minMaxReleaseDateCriteria = minMaxReleaseDateCriteria.lte(filter.getMaxReleaseDate());
            }
            releaseDateCriteria = minMaxReleaseDateCriteria;
        }
        if (releaseDateCriteria != null) {
            query.addCriteria(releaseDateCriteria);
        }
        // Ordenamiento
        if (filter.getSortBy() != null) {
            switch (filter.getSortBy()) {
                case RATING_DESC:
                    query.with(Sort.by(Sort.Direction.DESC, "rating"));
                    break;
                case RATING_ASC:
                    query.with(Sort.by(Sort.Direction.ASC, "rating"));
                    break;
                case RELEASE_DATE_DESC:
                    query.with(Sort.by(Sort.Direction.DESC, "releaseDate"));
                case RELEASE_DATE_ASC:
                    query.with(Sort.by(Sort.Direction.ASC, "releaseDate"));
                    break;
            }
        }
        return getCatalogItemPageResult(pagination, query);
    }

    @Override
    public PageResult<CatalogItem> findRelevantItems(CatalogType type, Pagination pagination) {
        Query query = new Query();
        query.addCriteria(Criteria.where("isRelevant").is(true).and("relevantUntil").gt(new java.util.Date()));
        query.addCriteria(Criteria.where("type").is(type.toString()));
        return getCatalogItemPageResult(pagination, query);
    }

    @Override
    public CatalogItem update(String id, CatalogItem item) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Item with id " + id + " does not exist");
        }
        CatalogItemDocument existing = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Item with id " + id + " does not exist"));
        CatalogItemDocument updatedDocument = CatalogItemMapper.toDocument(item);
        updatedDocument.setId(existing.getId()); // Preserve the existing ID
        CatalogItemDocument saved = repository.save(updatedDocument);
        return CatalogItemMapper.toDomain(saved);
    }

    private PageResult<CatalogItem> getCatalogItemPageResult(Pagination pagination, Query query) {
        query.with(PageRequest.of(pagination.getPage(), pagination.getSize()));

        List<CatalogItem> items = mongoTemplate.find(query, CatalogItemDocument.class).stream().map(CatalogItemMapper::toDomain).collect(Collectors.toList());

        return PageResult.of(items, pagination.getPage(), pagination.getSize());
    }

}
