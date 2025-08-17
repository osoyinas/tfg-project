package es.uah.pablopinas.social.application.ports.out;

import java.util.UUID;

public interface CatalogPort {
    boolean itemExists(UUID catalogItemId, String type);
}
