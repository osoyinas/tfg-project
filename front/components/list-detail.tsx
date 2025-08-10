"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Share2, Edit, Trash2 } from "lucide-react"
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
import { ListItemCard } from "@/components/lists/list-item-card"
import { cn } from "@/lib/utils"

interface ListDetailProps {
  list: {
    id: string
    name: string
    description: string
    type: "movie" | "book" | "series" | "mixed"
    items: { id: string; title: string; imageUrl: string; type: "movie" | "book" | "series"; rating?: number }[]
    isPublic: boolean
    createdAt: string
    updatedAt: string
  }
}

export function ListDetail({ list }: ListDetailProps) {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false)

  const availableContent = [
    {
      id: "m1",
      title: "Dune: Part Two",
      type: "movie",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.8,
    },
    {
      id: "b1",
      title: "Project Hail Mary",
      type: "book",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.7,
    },
    { id: "s1", title: "Breaking Bad", type: "series", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.9 },
    { id: "m2", title: "Oppenheimer", type: "movie", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.7 },
  ]

  return (
    <div className={cn("container mx-auto px-4 py-8 bg-dark-background text-dark-foreground min-h-screen")}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-list-purple mb-2">{list.name}</h1>
          <p className="text-dark-muted-foreground text-lg">{list.description}</p>
          <p className="text-dark-muted-foreground text-sm mt-1">
            Creada: {new Date(list.createdAt).toLocaleDateString()} | Actualizada:{" "}
            {new Date(list.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button
            variant="outline"
            className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent"
            onClick={() => setIsEditListModalOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            className="bg-dark-destructive text-dark-destructive-foreground hover:bg-dark-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <Separator className="my-8 bg-dark-border" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-list-purple">Elementos de la Lista ({list.items.length})</h2>
        <Button
          onClick={() => setIsAddItemModalOpen(true)}
          className="bg-list-purple text-dark-primary-foreground hover:bg-list-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Elemento
        </Button>
      </div>

      {list.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.items.map((item) => (
            <ListItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="bg-dark-card border-dark-border text-dark-foreground">
          <CardContent className="p-6 text-center">
            <p className="text-dark-muted-foreground">Esta lista está vacía. ¡Añade algunos elementos!</p>
            <Button
              onClick={() => setIsAddItemModalOpen(true)}
              className="mt-4 bg-list-purple text-dark-primary-foreground hover:bg-list-purple/90"
            >
              Añadir Primer Elemento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Añadir Elemento a {list.name}</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Selecciona un contenido existente para añadir a esta lista.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right text-dark-foreground">
                Contenido
              </Label>
              <Select>
                <SelectTrigger className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-list-purple focus:ring-list-purple">
                  <SelectValue placeholder="Selecciona un contenido" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                  {availableContent.map((content) => (
                    <SelectItem key={content.id} value={content.id}>
                      {content.title} ({content.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddItemModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-list-purple text-dark-primary-foreground hover:bg-list-purple/90">
              Añadir Elemento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit List Modal */}
      <Dialog open={isEditListModalOpen} onOpenChange={setIsEditListModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">Editar Lista: {list.name}</DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Modifica los detalles de tu lista.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list-name" className="text-right text-dark-foreground">
                Nombre
              </Label>
              <Input
                id="list-name"
                defaultValue={list.name}
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-list-purple focus:ring-list-purple"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list-description" className="text-right text-dark-foreground">
                Descripción
              </Label>
              <Textarea
                id="list-description"
                defaultValue={list.description}
                className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-list-purple focus:ring-list-purple"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list-type" className="text-right text-dark-foreground">
                Tipo
              </Label>
              <Select defaultValue={list.type}>
                <SelectTrigger className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-list-purple focus:ring-list-purple">
                  <SelectValue placeholder="Selecciona el tipo de lista" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                  <SelectItem value="movie">Películas</SelectItem>
                  <SelectItem value="book">Libros</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                  <SelectItem value="mixed">Mixta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditListModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-list-purple text-dark-primary-foreground hover:bg-list-purple/90">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
