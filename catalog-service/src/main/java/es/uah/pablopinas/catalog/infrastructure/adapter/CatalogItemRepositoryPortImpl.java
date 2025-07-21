package es.uah.pablopinas.catalog.infrastructure.adapter;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CatalogItemRepositoryPortImpl implements CatalogItemRepositoryPort {
    @Override
    public CatalogItem save(CatalogItem item) {
        return null;
    }

    @Override
    public Optional<CatalogItem> findById(String id) {
        return Optional.empty();
    }

    @Override
    public void deleteById(String id) {

    }

    @Override
    public PageResult<CatalogItem> findAll(int page, int size) {
        return null;
    }

    @Override
    public PageResult<CatalogItem> search(CatalogSearchFilter filter, int page, int size) {
        return null;
    }
}
