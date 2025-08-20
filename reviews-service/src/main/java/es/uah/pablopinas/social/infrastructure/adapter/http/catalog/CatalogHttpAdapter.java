package es.uah.pablopinas.social.infrastructure.adapter.http.catalog;

import es.uah.pablopinas.social.application.ports.out.CatalogPort;
import es.uah.pablopinas.social.infrastructure.adapter.http.AuthHttpClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class CatalogHttpAdapter extends AuthHttpClient implements CatalogPort {

    @Value("${catalog.url}")
    protected String catalogUrl;

    protected CatalogHttpAdapter(WebClient.Builder webBuilder) {
        super(webBuilder);
    }

    @Override
    public boolean itemExists(UUID catalogItemId, String type) {
        send(
                HttpMethod.GET,
                catalogUrl + "/items/" + catalogItemId,


        )
    }


}
