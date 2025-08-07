package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks;

import com.google.gson.Gson;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks.dto.GoogleBooksVolume;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks.dto.GoogleBooksVolumeList;
import lombok.RequiredArgsConstructor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class GoogleBooksSearchClient {

    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();

    @Value("${google.books.api-key}")
    private String apiKey;

    private static final String BASE_URL = "https://www.googleapis.com/books/v1/volumes";
    private static final String LANGUAGE = "es"; // Default language for results

    public GoogleBooksVolumeList searchVolumes(String query, int startIndex, int maxResults) throws IOException {
        String url = String.format("%s?q=%s&startIndex=%d&maxResults=%d&projection=full&langRestrict=%s&key=%s",
                BASE_URL, query.replace(" ", "+"), startIndex, maxResults, LANGUAGE, apiKey);
        return doRequest(url, GoogleBooksVolumeList.class);
    }

    public GoogleBooksVolume getVolumeById(String volumeId) throws IOException {
        String url = String.format("%s/%s?key=%s", BASE_URL, volumeId, apiKey);
        return doRequest(url, GoogleBooksVolume.class);
    }

    private <T> T doRequest(String url, Class<T> type) throws IOException {
        Request request = new Request.Builder().url(url).build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) return null;
            return gson.fromJson(response.body().string(), type);
        }
    }
}
