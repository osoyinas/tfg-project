package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbSearch;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.tools.ApiUrl;
import info.movito.themoviedbapi.tools.TmdbException;

public class TmdbBasicSearch extends TmdbSearch {
    public TmdbBasicSearch(TmdbApi tmdbApi) {
        super(tmdbApi);
    }

    public MovieResultsPage searchMovie(String query, Integer page) throws TmdbException {
        ApiUrl apiUrl = new ApiUrl(new Object[]{"search", "movie"});
        apiUrl.addPathParam("query", query);
        apiUrl.addQueryParam("include_adult", true);
        apiUrl.addPage(page);
        return (MovieResultsPage) this.mapJsonResult(apiUrl, MovieResultsPage.class);
    }
}
