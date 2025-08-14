import {
  BaseContentItem,
  BookItem,
  ContentType,
  ListItem,
  MovieItem,
  Pagination,
  SeriesItem,
} from "@/types";
import { AxiosInstance } from "axios";

interface Filters {
  title?: string;
  genre?: string;
  type?: ContentType;
  page?: number;
}

export async function getItems(
  filters: Filters,
  axios: AxiosInstance
): Promise<Pagination<MovieItem | BookItem | SeriesItem>> {
  try {
    if (filters.page === undefined || filters.page < 0) {
      filters.page = 0;
    }

    const response = await axios.get("/api/catalog/items", { params: filters });
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
