package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbSearch;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.TvSeriesResultsPage;
import info.movito.themoviedbapi.tools.ApiUrl;
import info.movito.themoviedbapi.tools.TmdbException;

public class TmdbBasicSearch extends TmdbSearch {

    private static final String language = "es-ES";

    public TmdbBasicSearch(TmdbApi tmdbApi) {
        super(tmdbApi);
    }

    public MovieResultsPage searchMovie(String query, Integer page) throws TmdbException {
        ApiUrl apiUrl = new ApiUrl("search", "movie");
        apiUrl.addPathParam("query", query);
        apiUrl.addQueryParam("include_adult", true);
        apiUrl.addLanguage(language);
        apiUrl.addPage(page);
        return this.mapJsonResult(apiUrl, MovieResultsPage.class);
    }

    public TvSeriesResultsPage searchTv(String query, Integer page) throws TmdbException {
        ApiUrl apiUrl = new ApiUrl("search", "tv");
        apiUrl.addPathParam("query", query);
        apiUrl.addQueryParam("include_adult", true);
        apiUrl.addLanguage(language);
        apiUrl.addPage(page);
        return this.mapJsonResult(apiUrl, TvSeriesResultsPage.class);
    }

}
