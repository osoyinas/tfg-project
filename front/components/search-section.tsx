"use client"

import { useState } from "react"
import { Search, Filter, Star, Calendar, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContentCard } from "@/components/content-card"

const mockSearchResults = [
  {
    id: 1,
    title: "Dune",
    type: "movie",
    year: 2021,
    rating: 4.5,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=120&width=80&text=Dune",
  },
  {
    id: 2,
    title: "Dune: Part Two",
    type: "movie",
    year: 2024,
    rating: 4.7,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=120&width=80&text=Dune+2",
  },
  {
    id: 3,
    title: "Dune (Book)",
    type: "book",
    year: 1965,
    rating: 4.8,
    genre: "Sci-Fi",
    author: "Frank Herbert",
    image: "/placeholder.svg?height=120&width=80&text=Dune+Book",
  },
]

interface SearchSectionProps {
  className?: string
}

export function SearchSection({ className }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ""}`}>
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-purple-600">Buscar</h1>
        <p className="text-gray-600 text-sm">Encuentra películas, libros y series</p>
      </div>

      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar películas, libros, series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-400"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <span className="text-sm text-gray-500">{mockSearchResults.length} resultados</span>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="border-purple-100 animate-in slide-in-from-top-2 duration-200">
            <CardContent className="p-3 sm:p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="movie">Películas</SelectItem>
                      <SelectItem value="book">Libros</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Género</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="action">Acción</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="comedy">Comedia</SelectItem>
                      <SelectItem value="scifi">Sci-Fi</SelectItem>
                      <SelectItem value="fantasy">Fantasía</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-purple-600">Resultados</h2>
        {/* {mockSearchResults.map((item, index) => (
          <ContentCard
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.image}
            rating={item.rating}
            type={item.type as "movie" | "book" | "series"}
            year={item.year}
            author={item.author}
            genre={item.genre}
            className="animate-in fade-in-0 slide-in-from-left-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
    
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{item.year}</span>
              {item.type === "book" && item.author && (
                <>
                  <span>•</span>
                  <span className="truncate">{item.author}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{item.genre}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">{item.rating}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs px-2 py-1 h-auto bg-transparent"
              >
                Ver detalles
              </Button>
            </div>
          </ContentCard>
        ))} */}
      </div>
    </div>
  )
}
