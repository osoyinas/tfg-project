"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Loader } from "@/components/loader"
import { ContentCard } from "@/components/content-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Dune: Part Two",
    "Project Hail Mary",
    "Breaking Bad",
  ])
  const [popularSearches] = useState<string[]>([
    "Oppenheimer",
    "The Midnight Library",
    "Stranger Things",
    "Poor Things",
    "Circe",
  ])

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }
    setIsLoading(true)
    setSearchTerm(term)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockResults = [
      {
        id: "1",
        title: "Dune: Part Two",
        type: "movie",
        imageUrl: "/placeholder.svg?height=300&width=200",
        rating: 4.8,
      },
      {
        id: "2",
        title: "Project Hail Mary",
        type: "book",
        imageUrl: "/placeholder.svg?height=300&width=200",
        rating: 4.7,
      },
      {
        id: "3",
        title: "Breaking Bad",
        type: "series",
        imageUrl: "/placeholder.svg?height=300&width=200",
        rating: 4.9,
      },
      { id: "4", title: "Dune (Book)", type: "book", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.5 },
    ].filter((item) => item.title.toLowerCase().includes(term.toLowerCase()))
    setResults(mockResults)
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]) // Keep last 5
    }
    setIsLoading(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setResults([])
  }

  return (
    <div className={cn("container mx-auto px-4 py-8 min-h-screen bg-dark-background text-dark-foreground")}>
      <h1 className="text-4xl font-bold mb-8 text-dark-primary">Buscar Contenido</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar películas, libros, series..."
          className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-dark-primary focus:ring-dark-primary text-dark-foreground placeholder:text-dark-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm)
            }
          }}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-dark-muted-foreground hover:bg-dark-accent"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader />
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-dark-primary">Resultados de la búsqueda</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && results.length === 0 && searchTerm.length > 0 && (
        <div className="mt-6 text-center text-dark-muted-foreground">
          No se encontraron resultados para "{searchTerm}".
        </div>
      )}

      {!isLoading && results.length === 0 && searchTerm.length === 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-dark-primary">Búsquedas Recientes</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer bg-dark-accent text-dark-foreground hover:bg-dark-accent/80"
                onClick={() => handleSearch(term)}
              >
                {term}
              </Badge>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3 text-dark-primary">Búsquedas Populares</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer bg-dark-accent text-dark-foreground hover:bg-dark-accent/80"
                onClick={() => handleSearch(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
