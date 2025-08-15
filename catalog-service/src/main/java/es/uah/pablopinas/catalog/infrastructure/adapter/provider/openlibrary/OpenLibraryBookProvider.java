package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.io.IOException;
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
                    .peek(this::enrichAsync)
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
                    .peek(this::enrichAsync)
                    .toList();

            return PageResult.of(items, pagination);
        } catch (Exception e) {
            log.error("Error fetching Open Library books: {}", e.getMessage(), e);
            return PageResult.empty(pagination);
        }
    }

    /**
     * Enriches a catalog item asynchronously by fetching additional details
     * from the Open Library API and saving the enriched item to the repository.
     */
    private void enrichAsync(CatalogItem item) {
        executor.submit(() -> {
            try {
                var detail = searchClient.fetchWorkDetail("/works/" + item.getExternalSource().getExternalId());
                var enriched = bookMapper.enrichWithWorkDetail(item, detail);
                catalogItemRepository.save(enriched);
                log.debug("Enriched and saved item: {}", item.getTitle());
            } catch (IOException e) {
                log.warn("Failed to enrich '{}': {}", item.getTitle(), e.getMessage());
            } catch (Exception e) {
                log.error("Unexpected error enriching '{}': {}", item.getTitle(), e.getMessage(), e);
            }
        });
    }

}
