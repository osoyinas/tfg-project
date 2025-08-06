package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component("openLibraryBookProvider")
@RequiredArgsConstructor
public class OpenLibraryBookProvider implements ExternalProviderStrategy {

    private final OpenLibrarySearchClient searchClient;
    private final OpenLibraryBookMapper bookMapper;
    private final CatalogItemRepositoryPort catalogItemRepository;
    private final TrendingSubjectsProvider trendingSubjectsProvider;

    private final ExecutorService executor = Executors.newFixedThreadPool(5);

    private static final List<String> TRENDING_SUBJECTS = List.of(
            "bestsellers", "popular", "fantasy", "romance", "science_fiction", "mystery", "historical_fiction", "young_adult"
    );

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
            List<String> subjects = trendingSubjectsProvider.getTrendingSubjects();
            int totalSubjects = subjects.size();

            // Cuántos resultados globales necesitamos
            int globalOffset = pagination.getPage() * pagination.getSize();
            int globalLimit = pagination.getSize();

            // Cuántos resultados por subject necesito *como máximo*
            int maxResultsNeeded = globalOffset + globalLimit;

            // Cuántas páginas locales necesito fetchear por subject
            int itemsPerSubject = (int) Math.ceil((double) maxResultsNeeded / totalSubjects);
            Pagination subjectPagination = new Pagination(0, itemsPerSubject);

            // Fetch libros de todos los subjects
            List<List<CatalogItem>> perSubjectItems = subjects.stream()
                    .map(subject -> {
                        try {
                            var result = searchClient.fetchFromSubject(subject, subjectPagination);
                            if (result != null && result.works() != null) {
                                return result.works().stream()
                                        .map(bookMapper::fromSubjectWork)
                                        .toList();
                            }
                        } catch (Exception e) {
                            log.warn("Failed to fetch subject '{}': {}", subject, e.getMessage());
                        }
                        return List.<CatalogItem>of();
                    })
                    .toList();

            // Mezclar round-robin
            List<CatalogItem> merged = interleave(perSubjectItems);

            // Recortar la página deseada
            int fromIndex = Math.min(globalOffset, merged.size());
            int toIndex = Math.min(fromIndex + globalLimit, merged.size());
            List<CatalogItem> pageItems = merged.subList(fromIndex, toIndex);

            return PageResult.of(pageItems, pagination);

        } catch (Exception e) {
            log.error("Error fetching trending books: {}", e.getMessage(), e);
            return PageResult.empty(pagination);
        }
    }

    private List<CatalogItem> interleave(List<List<CatalogItem>> lists) {
        List<CatalogItem> result = new ArrayList<>();
        int maxSize = lists.stream().mapToInt(List::size).max().orElse(0);

        for (int i = 0; i < maxSize; i++) {
            for (List<CatalogItem> list : lists) {
                if (i < list.size()) {
                    result.add(list.get(i));
                }
            }
        }

        return result;
    }

    /**
     * Enriches a catalog item asynchronously by fetching additional details
     * from the Open Library API and saving the enriched item to the repository.
     */
    private void enrichAsync(CatalogItem item) {
        executor.submit(() -> {
            try {
                var detail = searchClient.fetchWorkDetail(item.getExternalSource().getExternalId());
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
