package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.CreateCatalogItemUseCase;
import es.uah.pablopinas.catalog.application.port.in.DeleteCatalogItemUseCase;
import es.uah.pablopinas.catalog.application.port.in.GetCatalogItemByIdUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Application service responsible for basic CRUD operations on catalog items:
 * - Create new catalog items
 * - Retrieve catalog items by ID
 * - Delete catalog items by ID
 */
@Service
@RequiredArgsConstructor
public class CatalogItemCRUDService implements
        CreateCatalogItemUseCase,
        DeleteCatalogItemUseCase,
        GetCatalogItemByIdUseCase {

    private final CatalogItemRepositoryPort repository;

    /**
     * Creates a new catalog item if it doesn't already exist.
     *
     * @param item the item to create
     * @return the created or existing item
     * @throws IllegalArgumentException if the item already exists and cannot be duplicated
     */
    @Override
    public CatalogItem create(CatalogItem item) {
        if (repository.alreadyExists(item)) {
            return repository.findById(item.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Item already exists and cannot be created again"));
        }
        return repository.save(item);
    }

    /**
     * Deletes a catalog item by its ID.
     *
     * @param id the ID of the item to delete
     */
    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    /**
     * Retrieves a catalog item by its ID.
     *
     * @param id the ID of the item to retrieve
     * @return an Optional containing the item, or empty if not found
     */
    @Override
    public Optional<CatalogItem> getById(String id) {
        return repository.findById(id);
    }
}
