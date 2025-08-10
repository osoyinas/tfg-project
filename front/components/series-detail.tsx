"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, MessageSquare, List } from "lucide-react"
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
import { ContentCard } from "@/components/content-card" // Import ContentCard

interface SeriesDetailProps {
  series: {
    id: string
    title: string
    imageUrl: string
    rating: number
    genre: string
    creator: string
    cast: string[]
    description: string
    releaseYear: string
    seasons: number
    reviews: { id: string; user: string; rating: number; text: string; date: string }[]
  }
}

// Placeholder data for related content, activity, and reviews
const relatedSeries: any[] = [
  {
    id: "rs1",
    title: "Dark",
    type: "TV_SERIE",
    genre: "Sci-Fi",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.7,
    releaseYear: 2017,
  },
  {
    id: "rs2",
    title: "Mr. Robot",
    type: "TV_SERIE",
    genre: "Thriller",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.6,
    releaseYear: 2015,
  },
]

const seriesActivity: any[] = [
  {
    id: "sa1",
    type: "RATING",
    content: {
      id: "3",
      title: "Severance",
      type: "TV_SERIE",
      imageUrl: "/placeholder.svg?height=100&width=70",
    },
    rating: 4.7,
    timestamp: "3 hours ago",
    user: {
      id: "u1",
      name: "Alice",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "sa2",
    type: "ADDED_TO_LIST",
    content: {
      id: "3",
      title: "Severance",
      type: "TV_SERIE",
      imageUrl: "/placeholder.svg?height=100&width=70",
    },
    listName: "Top Mind-Bending Shows",
    timestamp: "1 day ago",
    user: {
      id: "u3",
      name: "Charlie",
      avatar: "/placeholder-user.jpg",
    },
  },
]

const seriesReviews: any[] = [
  {
    id: "sr1",
    content: {
      id: "3",
      title: "Severance",
      type: "TV_SERIE",
      imageUrl: "/placeholder.svg?height=100&width=70",
    },
    rating: 4.7,
    text: "A truly unique and unsettling show. The mystery keeps you hooked from beginning to end.",
    timestamp: "3 hours ago",
    user: {
      id: "u1",
      name: "Alice",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "sr2",
    content: {
      id: "3",
      title: "Severance",
      type: "TV_SERIE",
      imageUrl: "/placeholder.svg?height=100&width=70",
    },
    rating: 5,
    text: "Brilliant concept and execution. The performances are outstanding. Can't wait for more!",
    timestamp: "2 days ago",
    user: {
      id: "u2",
      name: "Bob",
      avatar: "/placeholder-user.jpg",
    },
  },
]

export function SeriesDetail({ series }: SeriesDetailProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false)

  const userLists = [
    { id: "1", name: "Series Favoritas" },
    { id: "2", name: "Series para Ver" },
    { id: "3", name: "Series de Drama" },
  ]

  return (
    <div className={cn("container mx-auto px-4 py-8 bg-dark-series-bg text-dark-foreground min-h-screen")}>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex justify-center">
          <img
            src={series.imageUrl || "/placeholder.svg"}
            alt={series.title}
            width={300}
            height={450}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-series-blue mb-2">{series.title}</h1>
          <p className="text-dark-muted-foreground text-lg mb-4">
            {series.genre} • {series.releaseYear} • {series.seasons} Temporadas
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-6 w-6 fill-yellow-500" />
              <span className="text-2xl font-bold">{series.rating}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-dark-border" />
            <ActionButtonsRow
              onReviewClick={() => setIsReviewModalOpen(true)}
              onAddToListClick={() => setIsAddToListModalOpen(true)}
              onShareClick={() => alert("Compartir serie")}
              onBookmarkClick={() => alert("Añadir a favoritos")}
              contentType="series"
            />
          </div>

          <p className="text-dark-foreground leading-relaxed mb-6">{series.description}</p>

          <div className="grid grid-cols-2 gap-4 text-dark-foreground mb-6">
            <div>
              <h3 className="font-semibold text-dark-primary">Creador:</h3>
              <p>{series.creator}</p>
            </div>
            <div>
              <h3 className="font-semibold text-dark-primary">Reparto Principal:</h3>
              <p>{series.cast.join(", ")}</p>
            </div>
          </div>

          <Separator className="my-8 bg-dark-border" />

          <h2 className="text-3xl font-bold text-series-blue mb-6">Reseñas</h2>
          {series.reviews.length > 0 ? (
            <div className="grid gap-6">
              {series.reviews.map((review) => (
                <ReviewCard key={review.id} review={{ ...review, contentType: "series", contentTitle: series.title }} />
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
            <DialogTitle className="text-dark-primary">Escribir una Reseña para {series.title}</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Comparte tus pensamientos y califica esta serie.
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
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="review" className="text-right text-dark-foreground">
                Reseña
              </Label>
              <Textarea
                id="review"
                placeholder="Escribe tu reseña aquí..."
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue"
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
            <Button type="submit" className="bg-series-blue text-dark-primary-foreground hover:bg-series-blue/90">
              Enviar Reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to List Modal */}
      <Dialog open={isAddToListModalOpen} onOpenChange={setIsAddToListModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Añadir {series.title} a una Lista</DialogTitle>
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
                <SelectTrigger className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-series-blue focus:ring-series-blue">
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddToListModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-series-blue text-dark-primary-foreground hover:bg-series-blue/90">
              Añadir a Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-dark-foreground">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {seriesActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <img
                  src={activity.user.avatar || "/placeholder.svg"}
                  alt={activity.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{activity.user.name}</p>
                  <p className="text-sm text-dark-muted-foreground">{activity.timestamp}</p>
                </div>
                <div className="ml-auto">
                  {activity.type === "RATING" && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-5 w-5 fill-yellow-500" />
                      <span>{activity.rating}</span>
                    </div>
                  )}
                  {activity.type === "ADDED_TO_LIST" && (
                    <div className="flex items-center gap-1">
                      <List className="h-5 w-5" />
                      <span>{activity.listName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-dark-foreground">Reseñas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {seriesReviews.map((review) => (
              <ReviewCard key={review.id} review={{ ...review, contentType: "series", contentTitle: series.title }} />
            ))}
            <Button
              variant="outline"
              className="w-full border-dark-border text-dark-foreground hover:bg-dark-accent bg-transparent"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Escribir Reseña
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-dark-foreground">Series Relacionadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedSeries.map((relatedSerie) => (
              <ContentCard key={relatedSerie.id} content={relatedSerie} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
