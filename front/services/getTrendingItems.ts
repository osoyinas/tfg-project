import { BookItem, ContentType, ListItem, MovieItem, Pagination, SeriesItem } from "@/types";
import { AxiosInstance } from "axios";

interface Filters {
  type: ContentType;
  page?: number;
  size?: number;
}

export async function getTrendingItems(
  filters: Filters, axios: AxiosInstance
): Promise<Pagination<MovieItem | BookItem | SeriesItem>> {
  const response = await axios.get("/api/catalog/items/trending", { params: filters });
  return response.data;
}
