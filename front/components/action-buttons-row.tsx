"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, List, Share2, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionButtonsRowProps {
  onReviewClick: () => void
  onAddToListClick: () => void
  onShareClick: () => void
  onBookmarkClick: () => void
  contentType: "movie" | "book" | "series"
}

export function ActionButtonsRow({
  onReviewClick,
  onAddToListClick,
  onShareClick,
  onBookmarkClick,
  contentType,
}: ActionButtonsRowProps) {
  const getAccentColorClass = () => {
    switch (contentType) {
      case "movie":
        return "text-movie-red hover:bg-movie-red/20"
      case "book":
        return "text-book-green hover:bg-book-green/20"
      case "series":
        return "text-series-blue hover:bg-series-blue/20"
      default:
        return "text-dark-primary hover:bg-dark-primary/20"
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onReviewClick}
        className={cn("text-dark-muted-foreground hover:text-dark-primary", getAccentColorClass())}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Escribir reseña</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onAddToListClick}
        className={cn("text-dark-muted-foreground hover:text-dark-primary", getAccentColorClass())}
      >
        <List className="h-5 w-5" />
        <span className="sr-only">Añadir a lista</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onShareClick}
        className={cn("text-dark-muted-foreground hover:text-dark-primary", getAccentColorClass())}
      >
        <Share2 className="h-5 w-5" />
        <span className="sr-only">Compartir</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBookmarkClick}
        className={cn("text-dark-muted-foreground hover:text-dark-primary", getAccentColorClass())}
      >
        <Bookmark className="h-5 w-5" />
        <span className="sr-only">Guardar</span>
      </Button>
    </div>
  )
}
