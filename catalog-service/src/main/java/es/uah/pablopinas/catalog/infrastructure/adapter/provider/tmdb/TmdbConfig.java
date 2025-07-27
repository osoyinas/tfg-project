package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import info.movito.themoviedbapi.TmdbApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TmbdConfig {

    @Value("${tmdb.api-key}")
    private String apiKey;

    @Bean
    public TmdbApi tmdbApi() {
        return new TmdbApi(apiKey);
    }

    @Bean
    public TmdbBasicSearch tmdbSearch(TmdbApi tmdbApi) {
        return new TmdbBasicSearch(tmdbApi);
    }
}