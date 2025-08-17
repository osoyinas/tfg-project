package es.uah.pablopinas.social.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class HttpConfig {
    @Bean
    WebClient keycloakWebClient(WebClient.Builder builder) {
        var http = HttpClient.create().responseTimeout(Duration.ofSeconds(10));
        return builder.clientConnector(new ReactorClientHttpConnector(http)).build();
    }
}
