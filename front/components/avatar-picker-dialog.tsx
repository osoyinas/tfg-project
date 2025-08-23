"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Ejemplo de imágenes libres de Unsplash/Pexels (puedes cambiar por otras)
const AVATAR_IMAGES = [
  // 🎬 Cine / Series
  "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=facearea&w=256&h=256&facepad=2", // Proyector cine
  "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=facearea&w=256&h=256&facepad=2", // Palomitas y cine
  "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=facearea&w=256&h=256&facepad=2", // Sala de cine

  // 🎭 Personajes / Estilo avatar
  "https://images.unsplash.com/photo-1502764613149-7f1d229e2300?auto=format&fit=facearea&w=256&h=256&facepad=2", // Chica con estilo cinematográfico
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&facepad=2", // Retrato avatar
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=256&h=256&facepad=2", // Hombre estilo retro

  // 📚 Libros (como Disney+ ofrece avatares de personajes de sagas literarias)
  "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=256&h=256&fit=crop", // Pila de libros
  "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&w=256&h=256&fit=crop", // Lectura acogedora
  "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&w=256&h=256&fit=crop", // Biblioteca

  // 🌌 Fantasía / Sci-fi (para estilo tipo Disney/Marvel/Star Wars)
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=facearea&w=256&h=256&facepad=2", // Neon futurista
  "https://images.unsplash.com/photo-1523983303491-6c7a61f60fcb?auto=format&fit=facearea&w=256&h=256&facepad=2", // Galaxia
  "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=facearea&w=256&h=256&facepad=2"  // Cosplay estilo superhéroe
];


interface AvatarPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (avatarUrl: string) => void
}

export function AvatarPickerDialog({ open, onOpenChange, onSelect }: AvatarPickerDialogProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (url: string) => {
    setSelected(url)
  }

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Elige tu avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {AVATAR_IMAGES.map((url, idx) => (
            <button
              key={url}
              className={`rounded-full border-4 transition-all duration-150 overflow-hidden focus:outline-none ${selected === url ? "border-dark-primary scale-110" : "border-transparent hover:border-dark-accent"}`}
              onClick={() => handleSelect(url)}
              aria-label={`Seleccionar avatar ${idx + 1}`}
              type="button"
            >
              <img src={url} alt={`Avatar ${idx + 1}`} className="w-24 h-24 object-cover" />
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="bg-dark-primary text-dark-primary-foreground hover:bg-dark-primary/90"
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
