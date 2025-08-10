"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { ContentCard } from "@/components/content/content-card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function MoviesSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGenre, setFilterGenre] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [isCreateMovieModalOpen, setIsCreateMovieModalOpen] = useState(false)

  const movies = [
    {
      id: "1",
      title: "Dune: Part Two",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.8,
      genre: "Sci-Fi",
    },
    {
      id: "2",
      title: "Oppenheimer",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.7,
      genre: "Biography",
    },
    { id: "3", title: "Past Lives", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.5, genre: "Romance" },
    {
      id: "4",
      title: "Spider-Man: Across the Spider-Verse",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.9,
      genre: "Animation",
    },
    {
      id: "5",
      title: "Killers of the Flower Moon",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.6,
      genre: "Crime",
    },
    { id: "6", title: "Poor Things", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.4, genre: "Sci-Fi" },
    {
      id: "7",
      title: "Anatomy of a Fall",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.3,
      genre: "Drama",
    },
    {
      id: "8",
      title: "Godzilla Minus One",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.2,
      genre: "Action",
    },
  ]

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = filterGenre === "all" || movie.genre === filterGenre
    const matchesRating = filterRating === "all" || movie.rating >= Number.parseFloat(filterRating)
    return matchesSearch && matchesGenre && matchesRating
  })

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 min-h-screen transition-colors duration-500",
        "bg-dark-movie-bg text-dark-foreground",
      )}
    >
      <h1 className="text-4xl font-bold mb-8 text-movie-red">Películas</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar películas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-movie-red focus:ring-movie-red text-dark-foreground placeholder:text-dark-muted-foreground"
          />
        </div>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-movie-red data-[state=open]:ring-movie-red">
            <SelectValue placeholder="Género" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
            <SelectItem value="all">Todos los géneros</SelectItem>
            <SelectItem value="Sci-Fi">Ciencia Ficción</SelectItem>
            <SelectItem value="Biography">Biografía</SelectItem>
            <SelectItem value="Romance">Romance</SelectItem>
            <SelectItem value="Animation">Animación</SelectItem>
            <SelectItem value="Crime">Crimen</SelectItem>
            <SelectItem value="Drama">Drama</SelectItem>
            <SelectItem value="Action">Acción</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-movie-red data-[state=open]:ring-movie-red">
            <SelectValue placeholder="Calificación" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
            <SelectItem value="all">Todas las calificaciones</SelectItem>
            <SelectItem value="4.5">4.5+</SelectItem>
            <SelectItem value="4.0">4.0+</SelectItem>
            <SelectItem value="3.5">3.5+</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsCreateMovieModalOpen(true)}
          className="w-full sm:w-auto bg-movie-red text-dark-primary-foreground hover:bg-movie-red/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Película
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredMovies.map((movie) => (
          <ContentCard key={movie.id} content={{ ...movie, type: "movie" }} />
        ))}
      </div>

      <Dialog open={isCreateMovieModalOpen} onOpenChange={setIsCreateMovieModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Añadir Nueva Película</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Introduce los detalles de la película que quieres añadir.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-dark-foreground">
                Título
              </Label>
              <Input
                id="title"
                defaultValue=""
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right text-dark-foreground">
                Género
              </Label>
              <Input
                id="genre"
                defaultValue=""
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right text-dark-foreground">
                Calificación
              </Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue="0"
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-dark-foreground">
                Descripción
              </Label>
              <Textarea
                id="description"
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateMovieModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-movie-red text-dark-primary-foreground hover:bg-movie-red/90">
              Guardar Película
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
