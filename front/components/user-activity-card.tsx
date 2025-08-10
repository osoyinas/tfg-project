import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Star, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserActivityCardProps {
  activity: {
    type: "review" | "list" | "rating"
    content: string
    rating?: number
    text?: string
    items?: number
    date: string
  }
}

export function UserActivityCard({ activity }: UserActivityCardProps) {
  const Icon = activity.type === "review" ? MessageSquare : activity.type === "list" ? List : Star

  const getAccentColorClass = () => {
    switch (activity.type) {
      case "review":
        return "text-dark-primary"
      case "list":
        return "text-list-purple"
      case "rating":
        return "text-yellow-500"
      default:
        return "text-dark-foreground"
    }
  }

  return (
    <Card className="bg-dark-card border-dark-border text-dark-foreground shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", getAccentColorClass())}>
          {activity.type === "review" && "Nueva Reseña"}
          {activity.type === "list" && "Nueva Lista"}
          {activity.type === "rating" && "Nueva Calificación"}
        </CardTitle>
        <Icon className={cn("h-4 w-4", getAccentColorClass())} />
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-dark-foreground">{activity.content}</p>
        {activity.rating && (
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-yellow-500" />
            <span className="text-sm">{activity.rating}</span>
          </div>
        )}
        {activity.text && <p className="text-sm text-dark-muted-foreground mt-2 line-clamp-2">&quot;{activity.text}&quot;</p>}
        {activity.items && <p className="text-sm text-dark-muted-foreground mt-2">{activity.items} elementos</p>}
        <p className="text-xs text-dark-muted-foreground mt-3">{activity.date}</p>
      </CardContent>
    </Card>
  )
}
