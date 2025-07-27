package es.uah.pablopinas.catalog.infrastructure.adapter.controller;

import es.uah.pablopinas.catalog.application.port.in.GetRelevantCatalogItemsUseCase;
import es.uah.pablopinas.catalog.application.service.CatalogSearchService;
import es.uah.pablopinas.catalog.application.service.CreateCatalogItemService;
import es.uah.pablopinas.catalog.application.service.DeleteCatalogItemService;
import es.uah.pablopinas.catalog.application.service.GetCatalogItemByIdService;
import es.uah.pablopinas.catalog.domain.model.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/catalog/items")
public class CatalogItemController {
    private final CreateCatalogItemService createService;
    private final DeleteCatalogItemService deleteService;
    private final GetCatalogItemByIdService getByIdService;
    private final CatalogSearchService searchService;
    private final GetRelevantCatalogItemsUseCase getRelevantCatalogItemsService;

    @PostMapping
    public ResponseEntity<CatalogItem> create(@RequestBody CatalogItem item) {
        CatalogItem created = createService.create(item);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        deleteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CatalogItem> getById(@PathVariable String id) {
        Optional<CatalogItem> item = getByIdService.getById(id);
        return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<PageResult<CatalogItem>> search(@RequestParam(required = false) String title,
                                                          @RequestParam() CatalogType type,
                                                          @Valid @ModelAttribute Pagination pagination) {
        CatalogSearchFilter filter = CatalogSearchFilter.builder().titleContains(title).type(type).build();
        PageResult<CatalogItem> result = searchService.search(filter, pagination);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/trending")
    public ResponseEntity<PageResult<CatalogItem>> getTrending(@RequestParam() CatalogType type,
                                                               @Valid @ModelAttribute Pagination pagination) {
        PageResult<CatalogItem> result = getRelevantCatalogItemsService.getRelevantCatalogItems(type, pagination);
        return ResponseEntity.ok(result);
    }
}

