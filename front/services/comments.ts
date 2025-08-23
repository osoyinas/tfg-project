export async function dislikeComment(commentId: string, axios: AxiosInstance): Promise<void> {
  try {
    await axios.delete(`/api/social/comments/${commentId}/like`);
  } catch (error) {
    console.error("Error disliking comment", error);
    throw error;
  }
}
import axios, { AxiosInstance } from "axios";
import { ReviewComment } from "@/types";

export interface GetReviewCommentsParams {
  reviewId: string;
  page?: number;
  size?: number;
}

export async function getReviewComments(
  params: GetReviewCommentsParams,
  axios: AxiosInstance
): Promise<ReviewComment[]> {
  const { reviewId, page = 0, size = 10 } = params;
  try {
    const response = await axios.get(`/api/social/comments`, {
      params: { reviewId, page, size },
    });
    return response.data.map(mapReviewComment);
  } catch (error) {
    console.error("Error fetching review comments", error);
    throw error;
  }
}
interface AddCommentProps {
  reviewId: string;
  text: string;
}

export function addComment(
  { reviewId, text }: AddCommentProps,
  axios: AxiosInstance
): Promise<ReviewComment> {
  return axios
    .post(`/api/social/comments`, { text, reviewId })
    .then((response) => mapReviewComment(response.data));
}

function mapReviewComment(comment: any): ReviewComment {
  return {
    id: comment.id,
    user: comment.user
      ? {
          id: comment.user.userid,
          name: comment.user.username,
          avatar: comment.user.profileImageUrl,
        }
      : null,
    reviewId: comment.reviewId,
    text: comment.text,
    createdAt: comment.createdAt,
    likesCount: comment.likesCount,
    likedByCurrentUser: comment.likedByCurrentUser,
  };
}
