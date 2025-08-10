"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { ContentCard } from "@/components/content-card"
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
import { SeriesItem } from "@/types"

export function SeriesSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGenre, setFilterGenre] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [isCreateSeriesModalOpen, setIsCreateSeriesModalOpen] = useState(false)

  const series = [
    {
      id: "1",
      title: "The Queen's Gambit",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.7,
      genre: "Drama",
    },
    { id: "2", title: "Breaking Bad", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.9, genre: "Crime" },
    {
      id: "3",
      title: "Stranger Things",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.6,
      genre: "Sci-Fi",
    },
    {
      id: "4",
      title: "The Crown",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.4,
      genre: "Historical",
    },
    { id: "5", title: "Ted Lasso", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.8, genre: "Comedy" },
    { id: "6", title: "Squid Game", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.5, genre: "Thriller" },
    { id: "7", title: "Chernobyl", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.9, genre: "Drama" },
    {
      id: "8",
      title: "The Mandalorian",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.6,
      genre: "Sci-Fi",
    },
  ]
  const filteredSeries: SeriesItem[] = [] // Replace with actual series data filtering logic

  // const filteredSeries = series.filter((s) => {
  //   const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesGenre = filterGenre === "all" || s.genre === filterGenre
  //   const matchesRating = filterRating === "all" || s.rating >= Number.parseFloat(filterRating)
  //   return matchesSearch && matchesGenre && matchesRating
  // })

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 min-h-screen transition-colors duration-500",
        "bg-dark-series-bg text-dark-foreground",
      )}
    >
      <h1 className="text-4xl font-bold mb-8 text-series-blue">Series</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-series-blue focus:ring-series-blue text-dark-foreground placeholder:text-dark-muted-foreground"
          />
        </div>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-series-blue data-[state=open]:ring-series-blue">
            <SelectValue placeholder="Género" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
            <SelectItem value="all">Todos los géneros</SelectItem>
            <SelectItem value="Drama">Drama</SelectItem>
            <SelectItem value="Crime">Crimen</SelectItem>
            <SelectItem value="Sci-Fi">Ciencia Ficción</SelectItem>
            <SelectItem value="Historical">Histórica</SelectItem>
            <SelectItem value="Comedy">Comedia</SelectItem>
            <SelectItem value="Thriller">Thriller</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-series-blue data-[state=open]:ring-series-blue">
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
          onClick={() => setIsCreateSeriesModalOpen(true)}
          className="w-full sm:w-auto bg-series-blue text-dark-primary-foreground hover:bg-series-blue/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Serie
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredSeries.map((s) => (
          <ContentCard key={s.id} content={{ ...s, type: "TV_SERIE" }} />
        ))}
      </div>

      <Dialog open={isCreateSeriesModalOpen} onOpenChange={setIsCreateSeriesModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Añadir Nueva Serie</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Introduce los detalles de la serie que quieres añadir.
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
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right text-dark-foreground">
                Género
              </Label>
              <Input
                id="genre"
                defaultValue=""
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue"
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
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-dark-foreground">
                Descripción
              </Label>
              <Textarea
                id="description"
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateSeriesModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-series-blue text-dark-primary-foreground hover:bg-series-blue/90">
              Guardar Serie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
