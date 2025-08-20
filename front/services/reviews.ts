
import {
  BaseContentItem,
  BookItem,
  MovieItem,
  Pagination,
  SeriesItem,
  Filters,
} from "@/types";
import { AxiosInstance } from "axios";

interface ReviewProps {
    id: string;
    rating: number;
    text: string;
    spoilers: boolean;
}

export async function createReview(
    review: ReviewProps,
  axios: AxiosInstance
): Promise<Pagination<MovieItem | BookItem | SeriesItem>> {
  try {
    const response = await axios.post("/api/social/reviews", {
        "catalog_item_id": review.id,
        "rating": review.rating,
        "text": review.text,
        "spoilers": review.spoilers
     });
    return response.data;
  } catch (error) {
    console.error("Error reviewing item", error);
    throw error;
  }
}
