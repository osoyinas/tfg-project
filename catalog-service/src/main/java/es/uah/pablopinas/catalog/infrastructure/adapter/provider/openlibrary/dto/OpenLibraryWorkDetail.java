package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto;

import com.nimbusds.jose.shaded.gson.JsonElement;

import java.util.List;

public record OpenLibraryWorkDetail(
        JsonElement description,
        List<String> subject,
        List<Integer> covers,
        List<AuthorRef> authors
) {
    public record AuthorRef(AuthorKey author) {
        public record AuthorKey(String key) {
        }
    }
}

