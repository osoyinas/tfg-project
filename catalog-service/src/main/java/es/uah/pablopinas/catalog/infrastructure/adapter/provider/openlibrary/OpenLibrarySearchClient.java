package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(java.time.Duration.ofSeconds(5))
            .readTimeout(java.time.Duration.ofSeconds(10))
            .writeTimeout(java.time.Duration.ofSeconds(10))
            .callTimeout(java.time.Duration.ofSeconds(15))
            .retryOnConnectionFailure(true)
            .build();
    private final Gson gson = new GsonBuilder().create();

    public OpenLibrarySearchResult searchBooks(String query, Pagination pagination) throws IOException {
        // Construimos q combinando el término del usuario + filtro de idioma
        String q = String.format("%s language:spa", query);

        String url = String.format(
                "https://openlibrary.org/search.json?q=%s&page=%d&limit=%d&fields=%s",
                URLEncoder.encode(q, StandardCharsets.UTF_8),
                pagination.getPage() + 1,
                pagination.getSize(),
                URLEncoder.encode(String.join(",",
                        "key",                       // /works/OL...
                        "title",
                        "description",
                        "author_name",               // lista => creators
                        "first_publish_year",        // => releaseDate (YYYY)
                        "cover_i",                   // => ImageSet via Covers API
                        "isbn",                      // lista, útil para BookDetails
                        "publisher",                 // lista => BookDetails.publisher (primero)
                        "number_of_pages_median",    // => BookDetails.pageCount
                        "subject",                   // lista => genres
                        "ratings_average",           // puede venir nulo
                        "ratings_count"              // puede venir nulo
                ), StandardCharsets.UTF_8)
        );

        return doRequest(url, OpenLibrarySearchResult.class);
    }

    public OpenLibrarySearchResult searchWeeklyTrendingBooks(Pagination pagination) throws IOException {
        String fields = String.join(",",
                "key",
                "title",
                "author_name",
                "first_publish_year",
                "cover_i",
                "isbn",
                "publisher",
                "number_of_pages_median",
                "subject",
                "ratings_average",
                "ratings_count"
        );

        String url = String.format(
                "https://openlibrary.org/search.json?q=%s&sort=trending&lang=es&page=%d&limit=%d&fields=%s",
                // trending_z_score > 0 (Lucene syntax); %7B0%%20TO%%20*%%5D == {0 TO *]
                URLEncoder.encode("trending_z_score:{0 TO *]", StandardCharsets.UTF_8),
                pagination.getPage() + 1,
                pagination.getSize(),
                URLEncoder.encode(fields, StandardCharsets.UTF_8)
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
                .header("User-Agent", "CatalogApp/1.0")
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
