'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, Calendar, Tag, X } from 'lucide-react'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'

const mockSearchResults = [
  {
    id: 1,
    title: "Dune",
    type: "movie",
    year: 2021,
    rating: 4.5,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=120&width=80&text=Dune"
  },
  {
    id: 2,
    title: "Dune: Part Two",
    type: "movie",
    year: 2024,
    rating: 4.7,
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=120&width=80&text=Dune+2"
  },
  {
    id: 3,
    title: "Dune (Book)",
    type: "book",
    year: 1965,
    rating: 4.8,
    genre: "Sci-Fi",
    author: "Frank Herbert",
    image: "/placeholder.svg?height=120&width=80&text=Dune+Book"
  }
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSelectedType('all')
      setSelectedGenre('all')
      setShowFilters(false)
    }
  }, [isOpen])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'bg-red-100 text-red-700'
      case 'book': return 'bg-green-100 text-green-700'
      case 'series': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'Película'
      case 'book': return 'Libro'
      case 'series': return 'Serie'
      default: return type
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-purple-600 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Contenido
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search Bar */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar películas, libros, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400"
                autoFocus
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
              <span className="text-sm text-gray-500">
                {mockSearchResults.length} resultados
              </span>
            </div>

            {/* Filters */}
            {showFilters && (
              <Card className="border-purple-100 animate-in slide-in-from-top-2 duration-200">
                <CardContent className="p-4 space-y-4">
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
            <h2 className="text-lg font-semibold text-purple-600">Resultados</h2>
            {mockSearchResults.map((item, index) => (
              <Card 
                key={item.id} 
                className="border-purple-100 transition-all duration-200 hover:shadow-md hover:border-purple-200 animate-in fade-in-0 slide-in-from-left-4 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  // Handle item selection
                  console.log('Selected item:', item)
                  onClose()
                }}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-18 sm:w-16 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-purple-700 truncate text-sm sm:text-base">{item.title}</h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{item.year}</span>
                            {item.type === 'book' && item.author && (
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
                        </div>
                        <Badge className={`${getTypeColor(item.type)} ml-2 flex-shrink-0`}>
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs sm:text-sm font-medium">{item.rating}</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs px-2 py-1 h-auto">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
