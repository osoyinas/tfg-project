
import {
  Review,
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
): Promise<Review> {
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

interface reviewsFilters  {
    userId?: string,
    itemId?: string,
    hasRating?: boolean,
    hasText?: boolean,
    page?: number,
    size?: number
}
export async function getReviews(
  itemId: string,
  filters: reviewsFilters,
  axios: AxiosInstance
): Promise<Review[]> {
  try {
    console.log("Fetching reviews with filters:", filters);
    const response = await axios.get(`/api/social/reviews`, {
      params: filters
    });
    return response.data.map(mapReview);
  } catch (error) {
    console.error("Error fetching reviews", error);
    throw error;
  }
}

function mapReview(review: any): Review {
  return {
    ...review,
    user: review.user ? {
      id: review.user.userid,
      name: review.user.username,
      avatar: review.user.profileImageUrl
    } : null
  };
}