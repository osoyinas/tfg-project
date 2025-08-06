package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import com.nimbusds.jose.shaded.gson.Gson;
import es.uah.pablopinas.catalog.domain.model.Pagination;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibrarySearchResult;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibrarySubjectResult;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibraryWorkDetail;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OpenLibrarySearchClient {

    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();
    
    public OpenLibrarySearchResult searchBooks(String query, Pagination pagination) throws IOException {
        String url = String.format(
                "https://openlibrary.org/search.json?q=%s&page=%d&limit=%d",
                URLEncoder.encode(query, StandardCharsets.UTF_8),
                pagination.getPage() + 1,
                pagination.getSize()
        );
        return doRequest(url, OpenLibrarySearchResult.class);
    }

    public OpenLibrarySubjectResult fetchFromSubject(String subject, Pagination pagination) throws IOException {
        String url = String.format(
                "https://openlibrary.org/subjects/%s.json",
                URLEncoder.encode(subject, StandardCharsets.UTF_8),
                pagination.getPage() * pagination.getSize(),
                pagination.getSize()
        );
        return doRequest(url, OpenLibrarySubjectResult.class);
    }

    private <T> T doRequest(String url, Class<T> type) throws IOException {
        Request request = new Request.Builder()
                .url(url)
                .header("User-Agent", "CatalogApp/1.0 contact@example.com")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) return null;
            return gson.fromJson(response.body().string(), type);
        }
    }

    public OpenLibraryWorkDetail fetchWorkDetail(String workKey) throws IOException {
        String url = "https://openlibrary.org" + workKey + ".json";
        return doRequest(url, OpenLibraryWorkDetail.class);
    }

}
