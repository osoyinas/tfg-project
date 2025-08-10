"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ActionButtonsRow } from "@/components/action-buttons-row"
import { ReviewCard } from "@/components/review-card"
import { cn } from "@/lib/utils"

interface MovieDetailProps {
  movie: {
    id: string
    title: string
    imageUrl: string
    rating: number
    genre: string
    director: string
    cast: string[]
    description: string
    releaseDate: string
    reviews: { id: string; user: string; rating: number; text: string; date: string }[]
  }
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false)

  const userLists = [
    { id: "1", name: "Películas Favoritas" },
    { id: "2", name: "Películas para Ver" },
    { id: "3", name: "Clásicos del Cine" },
  ]

  return (
    <div className={cn("container mx-auto px-4 py-8 bg-dark-movie-bg text-dark-foreground min-h-screen")}>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex justify-center">
          <img
            src={movie.imageUrl || "/placeholder.svg"}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-movie-red mb-2">{movie.title}</h1>
          <p className="text-dark-muted-foreground text-lg mb-4">
            {movie.genre} • {movie.releaseDate}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-6 w-6 fill-yellow-500" />
              <span className="text-2xl font-bold">{movie.rating}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-dark-border" />
            <ActionButtonsRow
              onReviewClick={() => setIsReviewModalOpen(true)}
              onAddToListClick={() => setIsAddToListModalOpen(true)}
              onShareClick={() => alert("Compartir película")}
              onBookmarkClick={() => alert("Añadir a favoritos")}
              contentType="movie"
            />
          </div>

          <p className="text-dark-foreground leading-relaxed mb-6">{movie.description}</p>

          <div className="grid grid-cols-2 gap-4 text-dark-foreground mb-6">
            <div>
              <h3 className="font-semibold text-dark-primary">Director:</h3>
              <p>{movie.director}</p>
            </div>
            <div>
              <h3 className="font-semibold text-dark-primary">Reparto Principal:</h3>
              <p>{movie.cast.join(", ")}</p>
            </div>
          </div>

          <Separator className="my-8 bg-dark-border" />

          <h2 className="text-3xl font-bold text-movie-red mb-6">Reseñas</h2>
          {movie.reviews.length > 0 ? (
            <div className="grid gap-6">
              {movie.reviews.map((review) => (
                <ReviewCard key={review.id} review={{ ...review, contentType: "movie", contentTitle: movie.title }} />
              ))}
            </div>
          ) : (
            <p className="text-dark-muted-foreground">No hay reseñas todavía. ¡Sé el primero en escribir una!</p>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Escribir una Reseña para {movie.title}</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Comparte tus pensamientos y califica esta película.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right text-dark-foreground">
                Calificación
              </Label>
              <Input
                id="rating"
                type="number"
                step="0.5"
                min="0"
                max="5"
                defaultValue="0"
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="review" className="text-right text-dark-foreground">
                Reseña
              </Label>
              <Textarea
                id="review"
                placeholder="Escribe tu reseña aquí..."
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-movie-red text-dark-primary-foreground hover:bg-movie-red/90">
              Enviar Reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to List Modal */}
      <Dialog open={isAddToListModalOpen} onOpenChange={setIsAddToListModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Añadir {movie.title} a una Lista</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Selecciona una lista existente o crea una nueva.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list" className="text-right text-dark-foreground">
                Lista
              </Label>
              <Select>
                <SelectTrigger className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-movie-red focus:ring-movie-red">
                  <SelectValue placeholder="Selecciona una lista" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                  {userLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new-list" className="font-semibold text-dark-primary">
                    + Crear Nueva Lista
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Conditional input for new list name if "new-list" is selected */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-list-name" className="text-right">
                Nombre de la Nueva Lista
              </Label>
              <Input id="new-list-name" defaultValue="" className="col-span-3" />
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddToListModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-movie-red text-dark-primary-foreground hover:bg-movie-red/90">
              Añadir a Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
