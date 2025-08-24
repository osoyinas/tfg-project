import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { likeReview, unlikeReview } from "@/services/reviews";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { ContentItem, Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  item?: ContentItem;
}

export function ReviewCard({ review, item }: ReviewCardProps) {
  const router = useRouter();
  const axios = useAuthAxios();
  // Para demo, si no hay commentsCount, mostrar 0
  const comments = review.commentsCount ?? 0;
  // Estado local para likes y si el usuario ha dado like
  const [likes, setLikes] = useState(review.likesCount ?? 0);
  const [liked, setLiked] = useState(review.likedByCurrentUser ?? false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (!liked) {
        await likeReview(review.id, axios);
        setLikes(likes + 1);
        setLiked(true);
      } else {
        await unlikeReview(review.id, axios);
        setLikes(Math.max(0, likes - 1));
        setLiked(false);
      }
    } catch (err) {
      // Opcional: feedback de error
    } finally {
      setLikeLoading(false);
    }
  };

  console.log("Rendering ReviewCard for review and item:", review);
  return (
    <Card
      className="bg-white/80 dark:bg-dark-card text-dark-foreground shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-xl border border-dark-border overflow-hidden"
      onClick={() => router.push(`/reviews/${review.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/reviews/${review.id}`);
      }}
    >
      {item && (
        <div className="flex flex-row items-center gap-4 px-6 pt-6 pb-2 bg-gradient-to-b from-dark-primary/10 to-transparent">
          {item.images?.thumbnail?.url ||
          item.images?.poster?.url ||
          item.images?.cover?.url ? (
            <img
              src={
                item.images.thumbnail?.url ||
                item.images.poster?.url ||
                item.images.cover?.url
              }
              alt={item.title}
              className="w-20 h-28 object-cover rounded-lg shadow-md border border-dark-border bg-dark-card"
              style={{ minWidth: 64, minHeight: 90 }}
            />
          ) : null}
          <span className="text-lg text-dark-muted-foreground">
            Reseña de{" "}
            <a
              className="font-semibold text-dark-primary"
              href={`/${item.type.toLowerCase()}s/${item.id}`}
            >
              {item.title}
            </a>
          </span>
        </div>
      )}

      <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-4 px-6">
        {review.user && (
          <a
            href={review.user.id ? `/profiles/${review.user.id}` : "/profiles/"}
            onClick={e => e.stopPropagation()}
            tabIndex={0}
            aria-label={`Ver perfil de ${review.user.name}`}
            className="focus:outline-none focus:ring-2 focus:ring-dark-primary rounded-full"
          >
            <Avatar className="h-12 w-12 shadow border border-dark-border">
              <AvatarImage src={review.user.avatar || "/placeholder-user.jpg"} alt={review.user.name} />
              <AvatarFallback className="bg-dark-accent text-dark-primary">
                {review.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </a>
        )}
        <div className="flex-1 min-w-0">
          <CardTitle className="text-xl font-bold text-dark-primary truncate">
            {review.user.name || "Usuario Anónimo"}
          </CardTitle>
          <CardDescription className="text-xs text-dark-muted-foreground mt-1">
            {review.spoilers ? "⚠️ Contiene spoilers" : "✅ Sin spoilers"}
          </CardDescription>
        </div>
        <div className="flex flex-col items-center min-w-[48px]">
          <span className="text-xs text-dark-muted-foreground">Nota</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-6 w-6 fill-yellow-500" />
            <span className="font-semibold text-2xl">{review.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-6 pb-4">
        <p className="text-dark-foreground leading-relaxed mb-3 text-base">
          {review.text}
        </p>
        <div className="flex items-center gap-6 mt-2">
          <button
            className={cn(
              "flex items-center gap-1 text-dark-muted-foreground focus:outline-none hover:text-dark-primary transition-colors",
              liked ? "text-dark-primary" : ""
            )}
            onClick={handleLike}
            disabled={likeLoading}
            aria-label={liked ? "Quitar like" : "Dar like"}
            type="button"
          >
            <ThumbsUp
              className={cn("h-5 w-5", liked ? "fill-dark-primary" : "")}
            />
            <span className="font-medium">{likes}</span>
          </button>
          <span className="flex items-center gap-1 text-dark-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{comments}</span>
          </span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-dark-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {review.createdAt && (
            <span className="text-[10px] text-dark-muted-foreground italic ml-2">
              (Editada)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
