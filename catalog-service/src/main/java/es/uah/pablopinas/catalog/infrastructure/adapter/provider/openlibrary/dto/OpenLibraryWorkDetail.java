package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

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

    public String extractDescription() {
        if (description == null || description.isJsonNull()) return null;

        if (description.isJsonPrimitive()) {
            // Puede ser string o number/bool. Solo retorna si es string.
            var prim = description.getAsJsonPrimitive();
            return prim.isString() ? prim.getAsString() : prim.toString();
        }

        if (description.isJsonObject()) {
            JsonObject obj = description.getAsJsonObject();
            // Formato típico de Open Library: { "type": "/type/text", "value": "..." }
            if (obj.has("value") && obj.get("value").isJsonPrimitive()) {
                return obj.getAsJsonPrimitive("value").getAsString();
            }
            // Otros casos raros: devuélvelo serializado para no petar
            return obj.toString();
        }

        // Arrays u otros: serializa
        return description.toString();
    }

}

