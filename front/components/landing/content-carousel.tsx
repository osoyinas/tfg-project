"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Film, Book, Tv } from "lucide-react"

const popularMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    rating: 4.8,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=300&width=200&text=Dune",
    type: "movie",
  },
  {
    id: 2,
    title: "Oppenheimer",
    rating: 4.7,
    genre: "Drama",
    image: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
    type: "movie",
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    rating: 4.9,
    genre: "Animation",
    image: "/placeholder.svg?height=300&width=200&text=Spider-Man",
    type: "movie",
  },
  {
    id: 4,
    title: "The Batman",
    rating: 4.6,
    genre: "Action",
    image: "/placeholder.svg?height=300&width=200&text=Batman",
    type: "movie",
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    rating: 4.8,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=300&width=200&text=Everything",
    type: "movie",
  },
]

const popularBooks = [
  {
    id: 1,
    title: "Fourth Wing",
    rating: 4.9,
    genre: "Fantasy",
    image: "/placeholder.svg?height=300&width=200&text=Fourth+Wing",
    type: "book",
  },
  {
    id: 2,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    rating: 4.7,
    genre: "Fiction",
    image: "/placeholder.svg?height=300&width=200&text=Tomorrow",
    type: "book",
  },
  {
    id: 3,
    title: "The Seven Husbands of Evelyn Hugo",
    rating: 4.8,
    genre: "Romance",
    image: "/placeholder.svg?height=300&width=200&text=Evelyn+Hugo",
    type: "book",
  },
  {
    id: 4,
    title: "Atomic Habits",
    rating: 4.6,
    genre: "Self-Help",
    image: "/placeholder.svg?height=300&width=200&text=Atomic+Habits",
    type: "book",
  },
  {
    id: 5,
    title: "The Midnight Library",
    rating: 4.5,
    genre: "Fiction",
    image: "/placeholder.svg?height=300&width=200&text=Midnight+Library",
    type: "book",
  },
]

const popularSeries = [
  {
    id: 1,
    title: "The Last of Us",
    rating: 4.9,
    genre: "Drama",
    image: "/placeholder.svg?height=300&width=200&text=Last+of+Us",
    type: "series",
  },
  {
    id: 2,
    title: "Wednesday",
    rating: 4.7,
    genre: "Comedy",
    image: "/placeholder.svg?height=300&width=200&text=Wednesday",
    type: "series",
  },
  {
    id: 3,
    title: "House of the Dragon",
    rating: 4.6,
    genre: "Fantasy",
    image: "/placeholder.svg?height=300&width=200&text=House+Dragon",
    type: "series",
  },
  {
    id: 4,
    title: "Stranger Things",
    rating: 4.8,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=300&width=200&text=Stranger+Things",
    type: "series",
  },
  {
    id: 5,
    title: "The Bear",
    rating: 4.9,
    genre: "Comedy",
    image: "/placeholder.svg?height=300&width=200&text=The+Bear",
    type: "series",
  },
]

function ContentCard({ item }: { item: any }) {
  const getIcon = () => {
    switch (item.type) {
      case "movie":
        return <Film className="h-4 w-4" />
      case "book":
        return <Book className="h-4 w-4" />
      case "series":
        return <Tv className="h-4 w-4" />
      default:
        return <Film className="h-4 w-4" />
    }
  }

  const getColor = () => {
    switch (item.type) {
      case "movie":
        return "text-movie-red"
      case "book":
        return "text-book-green"
      case "series":
        return "text-series-blue"
      default:
        return "text-primary"
    }
  }

  return (
    <Card className="flex-shrink-0 w-48 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <Badge className={`absolute top-2 left-2 ${getColor()} bg-background/80`}>
            {getIcon()}
            <span className="ml-1">{item.genre}</span>
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CarouselRow({ items, direction = "left" }: { items: any[]; direction?: "left" | "right" }) {
  return (
    <div className="relative overflow-hidden">
      <div className={`flex gap-4 ${direction === "left" ? "animate-slide-left" : "animate-slide-right"}`}>
        {[...items, ...items, ...items].map((item, index) => (
          <ContentCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export function ContentCarousel() {
  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contenido Popular</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre qué está viendo, leyendo y disfrutando nuestra comunidad
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-movie-red" />
              <h3 className="text-xl font-semibold">Películas Trending</h3>
            </div>
            <CarouselRow items={popularMovies} direction="left" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-6 w-6 text-book-green" />
              <h3 className="text-xl font-semibold">Libros Populares</h3>
            </div>
            <CarouselRow items={popularBooks} direction="right" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tv className="h-6 w-6 text-series-blue" />
              <h3 className="text-xl font-semibold">Series del Momento</h3>
            </div>
            <CarouselRow items={popularSeries} direction="left" />
          </div>
        </div>
      </div>
    </section>
  )
}
