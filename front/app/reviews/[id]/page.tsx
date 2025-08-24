"use client";

import { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { BaseContentItem, Review, ReviewComment } from "@/types";
import { getReviewById } from "@/services/reviews";
import { getItem } from "@/services/getItems";
import { useKeycloak } from "@/components/keycloak-provider";
import {
  getReviewComments,
  addComment,
  dislikeComment,
} from "@/services/comments";
import { CommentCard } from "@/components/content/comment-card";
import { useCallback } from "react";
import { ReviewCard } from "@/components/content/review-card";

// Puedes crear un servicio getReviewById en services/reviews.ts

export default function ReviewDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { authenticated, initialized } = useKeycloak();
  const axios = useAuthAxios();
  // Comentarios paginados
  // Scroll infinito: no necesitamos commentsPage
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const queryClient = useQueryClient();

  // (Ya declarados arriba)

  // Hook de comentarios (ahora después de definir id y axios)
  // Scroll infinito para comentarios
  const {
    data: commentsPages,
    isLoading: commentsLoading,
    isError: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery<ReviewComment[], Error>({
    queryKey: ["review-comments", id],
    queryFn: ({ pageParam = 0 }) =>
      getReviewComments(
        { reviewId: id, page: pageParam as number, size: 10 },
        axios
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length : undefined,
    enabled: !!id && !!axios && initialized && authenticated,
    initialPageParam: 0,
  });

  const commentMutation = useMutation({
    mutationFn: async (text: string) => {
      setCommentLoading(true);
      await addComment({ reviewId: id, text }, axios);
      setCommentLoading(false);
    },
    onSuccess: () => {
      setCommentInput("");
      refetchComments();
      queryClient.invalidateQueries({
        queryKey: ["review-comments", id],
      });
    },
    onError: () => setCommentLoading(false),
  });
  const [review, setReview] = useState<Review | null>(null);
  const [item, setItem] = useState<BaseContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated || !initialized) return;
    async function fetchReviewAndItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await getReviewById(id, axios);
        setReview(data);
        if (data?.catalogItemId) {
          try {
            const fetchedItem = await getItem(data.catalogItemId, axios);
            setItem(fetchedItem);
          } catch (itemErr) {
            setItem(null);
          }
        }
      } catch (err) {
        setError("No se pudo cargar la reseña.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchReviewAndItem();
  }, [id, axios, initialized, authenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }
  if (error || !review || !item) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error || "Error desconocido."}
      </div>
    );
  }

  // Estructura de imágenes como en content-detail
  const thumbnailUrl =
    item.images?.thumbnail?.url ||
    item.images?.poster?.url ||
    "/placeholder.svg";

  return (
    <div className="w-full min-h-screen bg-dark-background text-dark-foreground mb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Panoramic cover */}
        {/* Título y cover/thumbnail a la derecha */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-8">
          {item.images?.thumbnail?.url && (
            <div className="flex-shrink-0 ml-0 md:ml-4 mt-4 md:mt-0">
              <img
                src={item.images.thumbnail.url}
                alt={item.title}
                className="w-32 h-48 object-cover rounded-lg shadow-md border border-dark-border bg-dark-card"
                style={{ minWidth: 96, minHeight: 144 }}
              />
            </div>
          )}  
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-dark-primary">
              {item.title}
            </h1>
            <p className="text-dark-muted-foreground text-lg mb-4">
              {item.creators?.length > 0
                ? item.creators.slice(0, 2).join(", ") +
                  (item.creators.length > 2 ? "…" : "") +
                  " • "
                : ""}
              {item.genres?.length > 0 ? item.genres.join(", ") + " • " : ""}
              {item.releaseDate
                ? new Date(item.releaseDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <Separator className="my-8 bg-dark-border" />
          {/* Review principal */}
          <ReviewCard review={review} />
          {/* Comentarios de la review */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-dark-primary">
              Comentarios
            </h2>
            {/* Input para comentar */}
            <form
              className="flex gap-2 mb-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (!commentInput.trim() || commentLoading) return;
                commentMutation.mutate(commentInput.trim());
              }}
            >
              <input
                className="flex-1 rounded-md border border-dark-border bg-dark-background px-3 py-2 text-dark-foreground focus:outline-none focus:ring-2 focus:ring-dark-primary"
                placeholder="Escribe un comentario..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={commentLoading}
                maxLength={500}
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-dark-primary text-white font-semibold disabled:opacity-60"
                disabled={commentLoading || !commentInput.trim()}
              >
                Comentar
              </button>
            </form>
            {/* Lista de comentarios, sin scroll interno */}
            <div className="flex flex-col gap-3">
              {commentsLoading ? (
                <div className="text-center py-4">Cargando comentarios...</div>
              ) : commentsError ? (
                <div className="text-center text-red-500 py-4">
                  Error al cargar comentarios
                </div>
              ) : commentsPages &&
                commentsPages.pages &&
                commentsPages.pages.flat().length > 0 ? (
                commentsPages.pages.flat().map((comment: ReviewComment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onLike={async (liked) => {
                      if (!axios) return;
                      if (liked) {
                        // Like: POST
                        await axios.post(
                          `/api/social/comments/${comment.id}/like`
                        );
                      } else {
                        // Dislike: DELETE
                        await dislikeComment(comment.id, axios);
                      }
                      refetchComments();
                    }}
                  />
                ))
              ) : (
                <div className="text-dark-muted-foreground">
                  Sé el primero en comentar.
                </div>
              )}
              {isFetchingNextPage && (
                <div className="text-center py-2">Cargando más...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
