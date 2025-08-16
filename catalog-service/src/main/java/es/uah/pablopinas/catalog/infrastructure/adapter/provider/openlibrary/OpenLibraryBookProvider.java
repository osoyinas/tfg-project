package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component("openLibraryBookProvider")
@RequiredArgsConstructor
@Qualifier("catalogProviders")
public class OpenLibraryBookProvider implements ExternalProviderStrategy {

    private final OpenLibrarySearchClient searchClient;
    private final OpenLibraryBookMapper bookMapper;
    private final CatalogItemRepositoryPort catalogItemRepository;

    private final ExecutorService executor = Executors.newFixedThreadPool(5);

    @PreDestroy
    public void shutdown() {
        executor.shutdown();
    }

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.BOOK;
    }

    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        try {
            var result = searchClient.searchBooks(filter.getTitleContains(), pagination);
            if (result == null || result.docs() == null) {
                log.warn("No books found for filter: {}", filter);
                return PageResult.empty(pagination);
            }

            var items = result.docs().stream()
                    .map(bookMapper::fromSearchDoc)
                    .peek(this::asyncEnrichAndUpsert) // único save (upsert)
                    .toList();

            return PageResult.of(items, pagination);
        } catch (Exception e) {
            log.error("Error fetching Open Library books: {}", e.getMessage(), e);
            return PageResult.empty(pagination);
        }
    }

    @Override
    public PageResult<CatalogItem> fetchTrending(Pagination pagination) {
        try {
            var result = searchClient.searchWeeklyTrendingBooks(pagination);
            if (result == null || result.docs() == null) {
                return PageResult.empty(pagination);
            }

            var items = result.docs().stream()
                    .map(bookMapper::fromSearchDoc)
                    .peek(this::asyncEnrichAndUpsert) // único save (upsert)
                    .toList();

            return PageResult.of(items, pagination);
        } catch (Exception e) {
            log.error("Error fetching Open Library trending: {}", e.getMessage(), e);
            return PageResult.empty(pagination);
        }
    }

    /**
     * Asynchronous enrichment with a single save (upsert).
     * - Does not mutate the original item (builds an "enriched" from the mapper).
     * - If there are no changes, does not write.
     */
    private void asyncEnrichAndUpsert(CatalogItem item) {
        // Defensive external ID
        var source = item.getExternalSource();
        if (source == null || source.getExternalId() == null || source.getExternalId().isBlank()) {
            log.debug("Skipping enrichment for '{}' - missing externalId", item.getTitle());
            return;
        }

        String workKey = source.getExternalId().startsWith("/works/")
                ? source.getExternalId()
                : "/works/" + source.getExternalId();

        CompletableFuture
                .supplyAsync(() -> {
                    try {
                        return searchClient.fetchWorkDetail(workKey);
                    } catch (IOException e) {
                        throw new RuntimeException("OpenLibrary I/O: " + e.getMessage(), e);
                    }
                }, executor)
                .thenApply(detail -> {
                    try {
                        // Builds the "enriched" from the original item + detail (without mutating the original)
                        return bookMapper.enrichWithWorkDetail(item, detail);
                    } catch (Exception e) {
                        log.warn("Failed to map enrichment for '{}': {}", item.getTitle(), e.getMessage());
                        return null;
                    }
                })
                .thenAccept(enriched -> {
                    if (enriched == null) {
                        log.debug("No enrichment produced for '{}'", item.getTitle());
                        return;
                    }
//                    // If there are no relevant changes, avoid writing (optional, if your mapper already avoids nulls)
//                    if (isNoOp(item, enriched)) {
//                        log.debug("No enrichment changes for '{}', skipping save.", item.getTitle());
//                        return;
//                    }
                    try {
                        catalogItemRepository.save(enriched); // save = upsert
                        log.debug("Upserted OpenLibrary enrichment for '{}'", enriched.getTitle());
                    } catch (Exception e) {
                        log.warn("Failed to upsert enrichment for '{}': {}", item.getTitle(), e.getMessage());
                    }
                })
                .exceptionally(ex -> {
                    log.warn("Unexpected error enriching '{}': {}", item.getTitle(), ex.getMessage(), ex);
                    return null;
                });
    }

    /**
     * Compares relevant fields to avoid a save if there are no changes.
     */
    private boolean isNoOp(CatalogItem original, CatalogItem enriched) {
        boolean creatorsEq = Objects.equals(
                Optional.ofNullable(original.getCreators()).orElse(List.of()),
                Optional.ofNullable(enriched.getCreators()).orElse(List.of())
        );
        boolean detailsEq = Objects.equals(original.getDetails(), enriched.getDetails());
        boolean imagesEq = Objects.equals(original.getImages(), enriched.getImages());
        return creatorsEq && detailsEq && imagesEq;
    }
}
