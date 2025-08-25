
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
    justMine?: boolean,
    itemId?: string,
    hasRating?: boolean,
    hasText?: boolean,
    page?: number,
    size?: number
}
export async function getReviews(
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

export function getReviewById(id: string, axios: AxiosInstance): Promise<Review> {
  return axios.get(`/api/social/reviews/${id}`).then(response => mapReview(response.data));
}

function mapReview(review: any): Review {
  return {
    ...review,
    user: review.user ? {
      id: review.user.userId,
      name: review.user.username,
      avatar: review.user.profileImageUrl
    } : null
  };
}


export async function likeReview(
  reviewId: string,
  axios: AxiosInstance
): Promise<void> {
  try {
    await axios.post(`/api/social/reviews/${reviewId}/like`);
  } catch (error) {
    console.error("Error liking review", error);
    throw error;
  }
}

export async function unlikeReview(
  reviewId: string,
  axios: AxiosInstance
): Promise<void> {
  try {
    await axios.delete(`/api/social/reviews/${reviewId}/like`);
  } catch (error) {
    console.error("Error unliking review", error);
    throw error;
  }
}