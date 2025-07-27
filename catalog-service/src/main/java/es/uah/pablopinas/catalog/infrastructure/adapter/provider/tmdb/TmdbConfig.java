package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbGenre;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TmdbConfig {

    @Value("${tmdb.api-key}")
    private String apiKey;

    public static final String LANGUAGE = "es-ES";

    @Bean
    public TmdbApi tmdbApi() {
        return new TmdbApi(apiKey);
    }

    @Bean
    public TmdbBasicSearch tmdbSearch(TmdbApi tmdbApi) {
        return new TmdbBasicSearch(tmdbApi);
    }

    @Bean
    public TmdbGenre tmdbGenre(TmdbApi tmdbApi) {
        return tmdbApi.getGenre();
    }
}