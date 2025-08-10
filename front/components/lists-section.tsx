"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { ListOverviewCard } from "@/components/lists/list-overview-card"
import { CreateListModal } from "@/components/create-list-modal"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function ListsSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false)

  const lists = [
    {
      id: "1",
      name: "Películas Favoritas",
      description: "Mis películas imprescindibles de todos los tiempos.",
      items: 15,
      type: "movie",
    },
    {
      id: "2",
      name: "Libros para el Verano",
      description: "Lecturas ligeras y emocionantes para la temporada.",
      items: 8,
      type: "book",
    },
    {
      id: "3",
      name: "Series que Recomiendo",
      description: "Series que no te puedes perder.",
      items: 12,
      type: "series",
    },
    {
      id: "4",
      name: "Documentales Impactantes",
      description: "Documentales que te harán pensar.",
      items: 7,
      type: "movie",
    },
    {
      id: "5",
      name: "Novelas de Misterio",
      description: "Intrigas y suspense en cada página.",
      items: 10,
      type: "book",
    },
  ]

  const filteredLists = lists.filter((list) => {
    const matchesSearch =
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || list.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 min-h-screen transition-colors duration-500",
        "bg-dark-background text-dark-foreground",
      )}
    >
      <h1 className="text-4xl font-bold mb-8 text-list-purple">Mis Listas</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar listas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-list-purple focus:ring-list-purple text-dark-foreground placeholder:text-dark-muted-foreground"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px] bg-dark-input border-dark-border text-dark-foreground data-[state=open]:border-list-purple data-[state=open]:ring-list-purple">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="movie">Películas</SelectItem>
            <SelectItem value="book">Libros</SelectItem>
            <SelectItem value="series">Series</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsCreateListModalOpen(true)}
          className="w-full sm:w-auto bg-list-purple text-dark-primary-foreground hover:bg-list-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Nueva Lista
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => (
          <ListOverviewCard key={list.id} list={list} />
        ))}
      </div>

      <CreateListModal open={isCreateListModalOpen} onOpenChange={setIsCreateListModalOpen} />
    </div>
  )
}
