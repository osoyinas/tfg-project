package es.uah.pablopinas.social.infrastructure.adapter.http.lists;

import es.uah.pablopinas.social.application.ports.out.ListsPort;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ListsHttpAdapter implements ListsPort {
    @Override
    public long countPublicLists(String userId) {
        return 0;
    }
}
