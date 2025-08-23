import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ReviewComment } from "@/types";
import { useAuthAxios } from "@/hooks/useAuthAxios";

interface CommentCardProps {
  comment: ReviewComment;
  onLike?: (liked: boolean) => void;
}

export function CommentCard({ comment, onLike }: CommentCardProps) {
  const axios = useAuthAxios();
  const [likes, setLikes] = useState(comment.likesCount ?? 0);
  const [liked, setLiked] = useState(comment.likedByCurrentUser ?? false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (!liked) {
        await axios.post(`/api/social/comments/${comment.id}/like`);
        setLikes(likes + 1);
        setLiked(true);
        onLike?.(true);
      } else {
        await axios.delete(`/api/social/comments/${comment.id}/like`);
        setLikes(Math.max(0, likes - 1));
        setLiked(false);
        onLike?.(false);
      }
    } catch (err) {
      // Opcional: feedback de error
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <Card className="bg-inherit text-dark-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {comment.user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.user.avatar || "/placeholder-user.jpg"} alt={comment.user.name} />
            <AvatarFallback className="bg-dark-accent text-dark-primary">{comment.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <CardTitle className="text-base font-semibold text-dark-primary">{comment.user?.name || "Usuario Anónimo"}</CardTitle>
        </div>
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
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-dark-foreground leading-relaxed mb-1">{comment.text}</p>
        <p className="text-xs text-dark-muted-foreground text-right mt-2">
          {new Date(comment.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </CardContent>
    </Card>
  );
}
