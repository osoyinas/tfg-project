import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Book, Tv, List } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ListOverviewCardProps {
  list: {
    id: string
    name: string
    description: string
    items: number
    type: "movie" | "book" | "series" | "mixed"
  }
}

export function ListOverviewCard({ list }: ListOverviewCardProps) {
  const Icon = list.type === "movie" ? Film : list.type === "book" ? Book : list.type === "series" ? Tv : List // For mixed type

  const getAccentColorClass = () => {
    switch (list.type) {
      case "movie":
        return "text-movie-red"
      case "book":
        return "text-book-green"
      case "series":
        return "text-series-blue"
      case "mixed":
        return "text-list-purple"
      default:
        return "text-dark-primary"
    }
  }

  return (
    <Link href={`/lists/${list.id}`} className="block">
      <Card className="bg-dark-card border-dark-border text-dark-foreground shadow-md hover:shadow-lg hover:border-dark-primary transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={cn("text-lg font-semibold", getAccentColorClass())}>{list.name}</CardTitle>
          <Icon className={cn("h-5 w-5", getAccentColorClass())} />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-dark-muted-foreground line-clamp-2 mb-3">
            {list.description}
          </CardDescription>
          <div className="flex items-center justify-between text-sm text-dark-muted-foreground">
            <span>{list.items} elementos</span>
            <span className={cn("capitalize", getAccentColorClass())}>
              {list.type === "mixed" ? "Mixta" : list.type}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
