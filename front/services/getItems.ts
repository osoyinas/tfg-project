import { BookItem, ContentType, ListItem, MovieItem, Pagination, SeriesItem } from "@/types";
import { AxiosInstance } from "axios";

interface Filters {
  title?: string;
  genre?: string;
  type?: ContentType;
}

export async function getItems(
  filters: Filters, axios: AxiosInstance
): Promise<Pagination<MovieItem | BookItem | SeriesItem>> {
  const response = await axios.get("/api/catalog/items", { params: filters });
  return response.data;
}
