"use client"

import { Card } from "@/components/ui/card"
import { Star, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ListItemCardProps {
  item: {
    id: string
    title: string
    imageUrl: string
    type: "movie" | "book" | "series"
    rating?: number
  }
  onRemove?: (id: string) => void
}

export function ListItemCard({ item, onRemove }: ListItemCardProps) {
  const getAccentColorClass = () => {
    switch (item.type) {
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
    <Card className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg group bg-dark-card border-dark-border hover:border-dark-primary transition-all duration-200">
      <img
        src={item.imageUrl || "/placeholder.svg"}
        alt={item.title}
        width={200}
        height={300}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
        <h3 className="text-white text-base font-semibold line-clamp-2 mb-1">{item.title}</h3>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-medium capitalize", getAccentColorClass())}>{item.type}</span>
          {item.rating && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-3 w-3 fill-yellow-400" />
              <span className="text-xs font-semibold">{item.rating}</span>
            </div>
          )}
        </div>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-dark-card/80 text-dark-destructive hover:bg-dark-destructive/20 hover:text-dark-destructive transition-colors"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item from list"
        >
          <XCircle className="h-5 w-5" />
        </Button>
      )}
    </Card>
  )
}
