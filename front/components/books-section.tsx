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

export function BooksSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGenre, setFilterGenre] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false)

  const books = [
    {
      id: "1",
      title: "The Midnight Library",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.2,
      genre: "Fantasy",
    },
    {
      id: "2",
      title: "Project Hail Mary",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.7,
      genre: "Sci-Fi",
    },
    {
      id: "3",
      title: "Atomic Habits",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.5,
      genre: "Self-Help",
    },
    { id: "4", title: "Circe", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.3, genre: "Mythology" },
    {
      id: "5",
      title: "The Henna Artist",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.0,
      genre: "Historical Fiction",
    },
    {
      id: "6",
      title: "Where the Crawdads Sing",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.1,
      genre: "Mystery",
    },
    {
      id: "7",
      title: "The Vanishing Half",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 3.9,
      genre: "Fiction",
    },
    { id: "8", title: "Educated", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.6, genre: "Memoir" },
  ]

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = filterGenre === "all" || book.genre === filterGenre
    const matchesRating = filterRating === "all" || book.rating >= Number.parseFloat(filterRating)
    return matchesSearch && matchesGenre && matchesRating
  })

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 min-h-screen transition-colors duration-500",
        "bg-dark-book-bg text-dark-foreground",
      )}
    >
      <h1 className="text-4xl font-bold mb-8 text-book-green">Libros</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-book-green focus:ring-book-green text-dark-foreground placeholder:text-dark-muted-foreground"
          />
        </div>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-book-green data-[state=open]:ring-book-green">
            <SelectValue placeholder="Género" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
            <SelectItem value="all">Todos los géneros</SelectItem>
            <SelectItem value="Fantasy">Fantasía</SelectItem>
            <SelectItem value="Sci-Fi">Ciencia Ficción</SelectItem>
            <SelectItem value="Self-Help">Autoayuda</SelectItem>
            <SelectItem value="Mythology">Mitología</SelectItem>
            <SelectItem value="Historical Fiction">Ficción Histórica</SelectItem>
            <SelectItem value="Mystery">Misterio</SelectItem>
            <SelectItem value="Fiction">Ficción</SelectItem>
            <SelectItem value="Memoir">Memorias</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-book-green data-[state=open]:ring-book-green">
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
          onClick={() => setIsCreateBookModalOpen(true)}
          className="w-full sm:w-auto bg-book-green text-dark-primary-foreground hover:bg-book-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Libro
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredBooks.map((book) => (
          <ContentCard key={book.id} content={{ ...book, type: "book" }} />
        ))}
      </div>

      <Dialog open={isCreateBookModalOpen} onOpenChange={setIsCreateBookModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Añadir Nuevo Libro</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Introduce los detalles del libro que quieres añadir.
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
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-book-green focus:ring-book-green"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right text-dark-foreground">
                Autor
              </Label>
              <Input
                id="author"
                defaultValue=""
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-book-green focus:ring-book-green"
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
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-book-green focus:ring-book-green"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-dark-foreground">
                Descripción
              </Label>
              <Textarea
                id="description"
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-book-green focus:ring-book-green"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateBookModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-book-green text-dark-primary-foreground hover:bg-book-green/90">
              Guardar Libro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
