
import {
  BaseContentItem,
  BookItem,
  MovieItem,
  Pagination,
  SeriesItem,
  Filters,
} from "@/types";
import { AxiosInstance } from "axios";

export async function getItems(
  filters: Filters,
  axios: AxiosInstance
): Promise<Pagination<MovieItem | BookItem | SeriesItem>> {
  try {
    const params: Record<string, any> = {};
    if (filters.title) params.title = filters.title;
    if (filters.type && filters.type !== "Todos") params.type = filters.type;
    if (filters.min_year) params.min_year = filters.min_year;
    if (filters.max_year) params.max_year = filters.max_year;
    if (filters.min_rating !== undefined) params.min_rating = filters.min_rating;
    if (filters.max_rating !== undefined) params.max_rating = filters.max_rating;
    if (filters.genres && filters.genres.length > 0) params.genres = filters.genres.join(",");
    params.page = filters.page ?? 0;
    params.size = filters.size ?? 20;

    console.log("Fetching items with filters:", params);
    const response = await axios.get("/api/catalog/items", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

export async function getItem(
  id: BaseContentItem["id"],
  axios: AxiosInstance
): Promise<MovieItem | BookItem | SeriesItem> {
  try {
    const response = await axios.get(`/api/catalog/items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
}

export async function getItemsByIds(
  ids: BaseContentItem["id"][],
  axios: AxiosInstance
): Promise<(MovieItem | BookItem | SeriesItem)[]> {
  try {
    // Unir los ids por coma para la query string
    const idsParam = ids.join(",");
    const response = await axios.get("/api/catalog/items", { params: { ids: idsParam } });
    return response.data;
  } catch (error) {
    console.error("Error fetching items by IDs:", error);
    throw error;
  }
}