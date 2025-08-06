package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class GenresTranslator {

    private static final Map<String, String> GENRE_TRANSLATIONS = Map.ofEntries(
            Map.entry("fantasy", "Fantasía"),
            Map.entry("romance", "Romance"),
            Map.entry("adventure", "Aventura"),
            Map.entry("mystery", "Misterio"),
            Map.entry("thriller", "Suspense"),
            Map.entry("horror", "Terror"),
            Map.entry("science fiction", "Ciencia ficción"),
            Map.entry("historical", "Histórica"),
            Map.entry("young adult", "Juvenil"),
            Map.entry("fiction", "Ficción"),
            Map.entry("nonfiction", "No ficción"),
            Map.entry("action", "Acción"),
            Map.entry("detective", "Detectives"),
            Map.entry("poetry", "Poesía"),
            Map.entry("biography", "Biografía"),
            Map.entry("drama", "Drama"),
            Map.entry("humor", "Humor"),
            Map.entry("children", "Infantil"),
            Map.entry("classic", "Clásico"),
            Map.entry("self-help", "Autoayuda"),
            Map.entry("philosophy", "Filosofía"),
            Map.entry("psychology", "Psicología"),
            Map.entry("religion", "Religión")
    );

    /**
     * Cleans and translates a single word to its corresponding genre in Spanish.
     * If the word is not recognized, it returns null.
     */
    public List<String> translateCategories(List<String> rawCategories, int maxGenres) {
        if (rawCategories == null) return List.of();

        return rawCategories.stream()
                .flatMap(cat -> Arrays.stream(cat.split("[/]|&|,")))
                .map(String::trim)
                .filter(s -> s.length() > 2)
                .map(String::toLowerCase)
                .map(s -> s.replaceAll("[^a-z ]", ""))
                .map(this::translateWord)
                .filter(Objects::nonNull)
                .distinct()
                .limit(maxGenres)
                .collect(Collectors.toList());
    }

    /**
     * Translates a single word to its corresponding genre in Spanish.
     * If the word is not recognized, it returns null.
     */
    public String translateWord(String word) {
        return GENRE_TRANSLATIONS.get(word);
    }

    /**
     * Returns an unmodifiable map of genre translations.
     *
     * @return Unmodifiable map of genre translations from English to Spanish.
     */
    public Map<String, String> getDictionary() {
        return Collections.unmodifiableMap(GENRE_TRANSLATIONS);
    }
}