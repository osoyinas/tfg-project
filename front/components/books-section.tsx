import { Star, Heart, Bookmark, MessageCircle, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

const mockBooks = [
  {
    id: 1,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    year: 2023,
    rating: 4.6,
    userRating: 5,
    genre: "Fantasía",
    image: "/https://picsum.photos/seed/Fourth+Wing",
    trending: true
  },
  {
    id: 2,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    year: 2022,
    rating: 4.4,
    userRating: 4,
    genre: "Ficción",
    image: "/https://picsum.photos/seed/Tomorrow",
    trending: true
  },
  {
    id: 3,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    year: 2017,
    rating: 4.8,
    userRating: null,
    genre: "Romance",
    image: "/https://picsum.photos/seed/Evelyn+Hugo",
    trending: false
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    year: 2021,
    rating: 4.5,
    userRating: 5,
    genre: "Sci-Fi",
    image: "/https://picsum.photos/seed/Hail+Mary",
    trending: false
  }
]

interface BooksSectionProps {
  className?: string
  onItemSelect?: (type: string, id: number) => void
}

export function BooksSection({ className, onItemSelect }: BooksSectionProps) {
  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-600">Libros</h1>
          <p className="text-gray-600 text-sm">Descubre y califica libros</p>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          <span className="text-xs sm:text-sm font-medium text-green-600 hidden sm:block">Bestsellers</span>
        </div>
      </div>

      {/* Trending Books */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-green-600">📚 Más Leídos</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-3 sm:gap-4 pb-2">
            {mockBooks.filter(book => book.trending).map((book) => (
              <Card 
                key={book.id} 
                className="min-w-[120px] sm:min-w-[140px] border-green-100 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
                onClick={() => onItemSelect?.('book', book.id)}
              >
                <CardContent className="p-2 sm:p-3">
                  <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <img 
                      src={book.image || "/placeholder.svg"} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm truncate">{book.title}</h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{book.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* All Books */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-green-600">Todos los Libros</h2>
        <div className="space-y-3 sm:space-y-4">
          {mockBooks.map((book, index) => (
            <Card 
              key={book.id} 
              className="border-green-100 transition-all duration-200 hover:shadow-md hover:border-green-200 animate-in fade-in-0 slide-in-from-left-4 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onItemSelect?.('book', book.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-18 sm:w-16 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={book.image || "/placeholder.svg"} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-green-700 truncate text-sm sm:text-base">{book.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{book.author} • {book.year}</p>
                        <p className="text-xs text-gray-500">{book.genre}</p>
                      </div>
                      {book.trending && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs ml-2 flex-shrink-0">
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{book.rating}</span>
                      </div>
                      {book.userRating && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 hidden sm:inline">Tu rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${star <= book.userRating! ? 'fill-green-400 text-green-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 text-xs px-2 py-1 h-auto">
                        <Heart className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Me gusta</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 text-xs px-2 py-1 h-auto">
                        <Bookmark className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Leer después</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 text-xs px-2 py-1 h-auto">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Reseña</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
