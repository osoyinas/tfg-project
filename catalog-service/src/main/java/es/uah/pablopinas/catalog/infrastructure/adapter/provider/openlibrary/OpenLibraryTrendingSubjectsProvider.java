package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import es.uah.pablopinas.catalog.domain.model.Pagination;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibrarySubjectResult;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenLibraryTrendingSubjectsProvider {

    private final OpenLibrarySearchClient searchClient;

    // Lista cacheada de subjects trending
    private final List<String> trendingSubjects = new CopyOnWriteArrayList<>();

    // Subjects base que quieres incluir siempre
    private static final List<String> DEFAULT_SUBJECTS = List.of(
            "popular", "fantasy", "romance", "science_fiction", "mystery", "historical_fiction", "young_adult"
    );

    @PostConstruct
    public void init() {
        refreshSubjects();
    }

    @Scheduled(fixedRate = 6 * 60 * 60 * 1000) // cada 6 horas
    public void refreshSubjects() {
        List<String> refreshed = new ArrayList<>();

        for (String subject : DEFAULT_SUBJECTS) {
            try {
                OpenLibrarySubjectResult result = searchClient.fetchFromSubject(subject, new Pagination(0, 1));
                if (result != null && result.works() != null && !result.works().isEmpty()) {
                    refreshed.add(subject);
                } else {
                    log.warn("Subject '{}' is empty or failed", subject);
                }
            } catch (Exception e) {
                log.warn("Failed to check subject '{}': {}", subject, e.getMessage());
            }
        }

        if (!refreshed.isEmpty()) {
            trendingSubjects.clear();
            trendingSubjects.addAll(refreshed);
            log.info("Updated trending subjects: {}", trendingSubjects);
        }
    }

    public List<String> getTrendingSubjects() {
        return Collections.unmodifiableList(trendingSubjects.isEmpty() ? DEFAULT_SUBJECTS : trendingSubjects);
    }

    public String getSubjectForPage(int page) {
        List<String> list = getTrendingSubjects();
        return list.get(page % list.size());
    }

    public int getLocalPageForGlobalPage(int page) {
        List<String> list = getTrendingSubjects();
        return page / list.size();
    }
}
