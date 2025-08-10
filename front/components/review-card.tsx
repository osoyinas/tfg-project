import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewCardProps {
  review: {
    id: string
    user?: string // Optional, if review is from current user or anonymous
    contentTitle: string
    contentType: "movie" | "book" | "series"
    rating: number
    text: string
    date: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getContentTypeColor = () => {
    switch (review.contentType) {
      case "movie":
        return "text-movie-red"
      case "book":
        return "text-book-green"
      case "series":
        return "text-series-blue"
      default:
        return "text-dark-primary"
    }
  }

  return (
    <Card className="bg-dark-card border-dark-border text-dark-foreground shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {review.user && (
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" alt={review.user} />
            <AvatarFallback className="bg-dark-accent text-dark-primary">{review.user.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-dark-primary">{review.user || "Usuario Anónimo"}</CardTitle>
          <CardDescription className="text-sm text-dark-muted-foreground">
            Reseña de <span className={cn("font-medium", getContentTypeColor())}>{review.contentTitle}</span> (
            {review.contentType})
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-yellow-500" />
          <span className="text-base font-semibold">{review.rating}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-dark-foreground leading-relaxed mb-3">{review.text}</p>
        <p className="text-xs text-dark-muted-foreground text-right">{review.date}</p>
      </CardContent>
    </Card>
  )
}
