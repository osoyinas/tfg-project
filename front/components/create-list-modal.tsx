"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface CreateListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateListModal({ open, onOpenChange }: CreateListModalProps) {
  const [listName, setListName] = useState("")
  const [listDescription, setListDescription] = useState("")
  const [listType, setListType] = useState("mixed")
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = () => {
    console.log({ listName, listDescription, listType, isPublic })
    // Here you would typically send this data to your backend
    onOpenChange(false)
    setListName("")
    setListDescription("")
    setListType("mixed")
    setIsPublic(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
        <DialogHeader>
          <DialogTitle className="text-dark-primary">Crear Nueva Lista</DialogTitle>
          <DialogDescription className="text-dark-muted-foreground">
            Organiza tus películas, libros y series favoritas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-dark-foreground">
              Nombre
            </Label>
            <Input
              id="name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-dark-primary focus:ring-dark-primary"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-dark-foreground">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              placeholder="Una breve descripción de tu lista..."
              className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-dark-primary focus:ring-dark-primary"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-dark-foreground">
              Tipo
            </Label>
            <Select value={listType} onValueChange={setListType}>
              <SelectTrigger className="col-span-3 bg-dark-input border-dark-border text-dark-foreground focus:border-dark-primary focus:ring-dark-primary">
                <SelectValue placeholder="Selecciona el tipo de contenido" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                <SelectItem value="mixed">Mixta (Películas, Libros, Series)</SelectItem>
                <SelectItem value="movie">Solo Películas</SelectItem>
                <SelectItem value="book">Solo Libros</SelectItem>
                <SelectItem value="series">Solo Series</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public" className="text-right text-dark-foreground">
              Pública
            </Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="col-span-3 data-[state=checked]:bg-dark-primary data-[state=unchecked]:bg-dark-input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-dark-primary text-dark-primary-foreground hover:bg-dark-primary/90"
          >
            Crear Lista
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
