package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks.dto;

import java.util.List;

public record GoogleBooksVolumeList(
        List<GoogleBooksVolume> items
) {
}
