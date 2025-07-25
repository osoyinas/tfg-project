package es.uah.pablopinas.catalog.infrastructure.adapter.controller;

import es.uah.pablopinas.catalog.application.service.*;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/api/v1/catalog/items")
public class CatalogItemController {
    private final CreateCatalogItemService createService;
    private final DeleteCatalogItemService deleteService;
    private final FetchExternalCatalogItemService fetchExternalService;
    private final GetCatalogItemByIdService getByIdService;
    private final SearchCatalogItemsService searchService;

    @Autowired
    public CatalogItemController(CreateCatalogItemService createService,
                                 DeleteCatalogItemService deleteService,
                                 FetchExternalCatalogItemService fetchExternalService,
                                 GetCatalogItemByIdService getByIdService,
                                 SearchCatalogItemsService searchService) {
        this.createService = createService;
        this.deleteService = deleteService;
        this.fetchExternalService = fetchExternalService;
        this.getByIdService = getByIdService;
        this.searchService = searchService;
    }

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
                                                          @RequestParam(required = false) CatalogType type,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) {
        CatalogSearchFilter filter = CatalogSearchFilter.builder().titleContains(title).type(type).build();
        PageResult<CatalogItem> result = searchService.search(filter, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/me")
    public Object getUserInfo(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        // Puedes acceder a los claims directamente
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        Object roles = jwt.getClaims().get("realm_access"); // o resource_access
        Object resourceAccess = jwt.getClaims().get("resource_access");
        return Map.of(
                "username", username,
                "email", email,
                "roles", roles,
                "resourceAccess", resourceAccess
        );
    }
}

