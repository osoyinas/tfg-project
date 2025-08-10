import { Star, Heart, Bookmark, MessageCircle, Play } from 'lucide-react'
import { Card, CardContent } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { ScrollArea } from '@components/ui/scroll-area'

const mockSeries = [
  {
    id: 1,
    title: "The Last of Us",
    year: 2023,
    rating: 4.8,
    userRating: 5,
    genre: "Drama",
    seasons: 1,
    image: "/https://picsum.photos/seed/The+Last+of+Us",
    trending: true
  },
  {
    id: 2,
    title: "Wednesday",
    year: 2022,
    rating: 4.3,
    userRating: 4,
    genre: "Misterio",
    seasons: 1,
    image: "/https://picsum.photos/seed/Wednesday",
    trending: true
  },
  {
    id: 3,
    title: "House of the Dragon",
    year: 2022,
    rating: 4.5,
    userRating: null,
    genre: "Fantasía",
    seasons: 2,
    image: "/https://picsum.photos/seed/House+Dragon",
    trending: false
  },
  {
    id: 4,
    title: "Stranger Things",
    year: 2016,
    rating: 4.7,
    userRating: 5,
    genre: "Sci-Fi",
    seasons: 4,
    image: "/https://picsum.photos/seed/Stranger+Things",
    trending: false
  }
]

interface SeriesSectionProps {
  className?: string
  onItemSelect?: (type: string, id: number) => void
}

export function SeriesSection({ className, onItemSelect }: SeriesSectionProps) {
  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Series</h1>
          <p className="text-gray-600 text-sm">Descubre y califica series</p>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <span className="text-xs sm:text-sm font-medium text-blue-600 hidden sm:block">Streaming</span>
        </div>
      </div>

      {/* Trending Series */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-blue-600">📺 Más Vistas</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-3 sm:gap-4 pb-2">
            {mockSeries.filter(series => series.trending).map((series) => (
              <Card 
                key={series.id} 
                className="min-w-[120px] sm:min-w-[140px] border-blue-100 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
                onClick={() => onItemSelect?.('series', series.id)}
              >
                <CardContent className="p-2 sm:p-3">
                  <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <img 
                      src={series.image || "/placeholder.svg"} 
                      alt={series.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm truncate">{series.title}</h3>
                  <p className="text-xs text-gray-500">{series.year}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{series.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* All Series */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-blue-600">Todas las Series</h2>
        <div className="space-y-3 sm:space-y-4">
          {mockSeries.map((series, index) => (
            <Card 
              key={series.id} 
              className="border-blue-100 transition-all duration-200 hover:shadow-md hover:border-blue-200 animate-in fade-in-0 slide-in-from-left-4 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onItemSelect?.('series', series.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-18 sm:w-16 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={series.image || "/placeholder.svg"} 
                      alt={series.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-blue-700 truncate text-sm sm:text-base">{series.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{series.year} • {series.genre}</p>
                        <p className="text-xs text-gray-500">{series.seasons} temporada{series.seasons > 1 ? 's' : ''}</p>
                      </div>
                      {series.trending && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs ml-2 flex-shrink-0">
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{series.rating}</span>
                      </div>
                      {series.userRating && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 hidden sm:inline">Tu rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${star <= series.userRating! ? 'fill-blue-400 text-blue-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-auto">
                        <Heart className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Me gusta</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-auto">
                        <Bookmark className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Ver después</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-auto">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Comentar</span>
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
