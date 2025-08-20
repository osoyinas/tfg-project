import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthAxios } from "@/hooks/useAuthAxios"
import { Review } from "@/types"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {


  return (
    <Card className="bg-inherit text-dark-foreground shadow-md hover:shadow-lg transition-shadow">
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
        <p className="text-xs text-dark-muted-foreground text-right">
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
