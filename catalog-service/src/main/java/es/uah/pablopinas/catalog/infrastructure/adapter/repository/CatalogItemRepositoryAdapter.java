package es.uah.pablopinas.catalog.infrastructure.adapter.repository;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper.CatalogItemMapper;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogItemDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
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
    public Optional<CatalogItem> findById(String id) {
        return repository.findById(id)
                .map(CatalogItemMapper::toDomain);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public PageResult<CatalogItem> findAll(int page, int size) {
        org.springframework.data.domain.Page<CatalogItemDocument> result =
                repository.findAll(PageRequest.of(page, size));
        List<CatalogItem> items = result.getContent().stream()
                .map(CatalogItemMapper::toDomain)
                .collect(Collectors.toList());
        return new PageResult<>(items, page, size, result.getTotalElements());
    }

    @Override
    public PageResult<CatalogItem> search(CatalogSearchFilter filter, int page, int size) {
        Query query = new Query();

        if (filter.getTitleContains() != null) {
            query.addCriteria(Criteria.where("title").regex(".*" + filter.getTitleContains() + ".*", "i"));
        }
        if (filter.getType() != null) {
            query.addCriteria(Criteria.where("type").is(filter.getType()));
        }
        if (filter.getGenre() != null) {
            query.addCriteria(Criteria.where("genres").in(filter.getGenre()));
        }
        if (filter.getReleaseYear() != null) {
            query.addCriteria(Criteria.where("releaseYear").is(filter.getReleaseYear()));
        }

        long total = mongoTemplate.count(query, CatalogItemDocument.class);
        query.with(PageRequest.of(page, size));

        List<CatalogItem> items = mongoTemplate.find(query, CatalogItemDocument.class).stream()
                .map(CatalogItemMapper::toDomain)
                .collect(Collectors.toList());

        return new PageResult<>(items, page, size, total);
    }
}
