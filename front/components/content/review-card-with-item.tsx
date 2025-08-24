import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { likeReview, unlikeReview } from "@/services/reviews"
import { useAuthAxios } from "@/hooks/useAuthAxios"
import { Review } from "@/types"


interface ReviewCardProps {
  review: Review
}

export function ReviewCardWithItem({ review }: ReviewCardProps) {
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

  return (
    <Card
      className="bg-inherit text-dark-foreground shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/reviews/${review.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") router.push(`/reviews/${review.id}`) }}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {review.user && (
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" alt={review.user.name} />
            <AvatarFallback className="bg-dark-accent text-dark-primary">{review.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-dark-primary">{review.user.name || "Usuario Anónimo"}</CardTitle>
          <CardDescription className="text-sm text-dark-muted-foreground">
            {review.spoilers ? "⚠️ Contiene spoilers" : "✅ Sin spoilers"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-6 w-6 fill-yellow-500" />
          <span className="font-semibold text-2xl">{review.rating}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-dark-foreground leading-relaxed mb-3">{review.text}</p>
        <div className="flex items-center gap-4 mt-2">
          <button
            className={cn("flex items-center gap-1 text-dark-muted-foreground focus:outline-none", liked ? "text-dark-primary" : "")}
            onClick={handleLike}
            disabled={likeLoading}
            aria-label={liked ? "Quitar like" : "Dar like"}
            type="button"
          >
            <ThumbsUp className={cn("h-4 w-4", liked ? "fill-dark-primary" : "")}/>
            {likes}
          </button>
          <span className="flex items-center gap-1 text-dark-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {comments}
          </span>
        </div>
        <p className="text-xs text-dark-muted-foreground text-right mt-2">
          {new Date(review.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </CardContent>
    </Card>
  )
}
