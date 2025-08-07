import { Heart, MessageCircle, Share, Star, User, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const mockFeedItems = [
  {
    id: 1,
    user: {
      name: "María García",
      username: "@maria_reads",
      avatar: "/placeholder.svg?height=40&width=40&text=MG"
    },
    action: "calificó",
    item: {
      title: "Fourth Wing",
      type: "book",
      image: "/placeholder.svg?height=80&width=60&text=Fourth+Wing"
    },
    rating: 5,
    comment: "¡Increíble libro! No pude parar de leer. Los dragones y la academia militar están perfectamente desarrollados.",
    timestamp: "hace 2 horas",
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    user: {
      name: "Carlos López",
      username: "@carlos_cine",
      avatar: "/placeholder.svg?height=40&width=40&text=CL"
    },
    action: "agregó a su lista",
    item: {
      title: "Oppenheimer",
      type: "movie",
      image: "/placeholder.svg?height=80&width=60&text=Oppenheimer"
    },
    listName: "Películas por ver",
    timestamp: "hace 4 horas",
    likes: 8,
    comments: 1
  },
  {
    id: 3,
    user: {
      name: "Ana Martín",
      username: "@ana_series",
      avatar: "/placeholder.svg?height=40&width=40&text=AM"
    },
    action: "terminó de ver",
    item: {
      title: "The Last of Us",
      type: "series",
      image: "/placeholder.svg?height=80&width=60&text=TLOU"
    },
    rating: 5,
    comment: "Una obra maestra. La actuación de Pedro Pascal es excepcional y la adaptación respeta perfectamente el videojuego.",
    timestamp: "hace 6 horas",
    likes: 24,
    comments: 7
  }
]

interface FeedSectionProps {
  className?: string
}

export function FeedSection({ className }: FeedSectionProps) {
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
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-orange-600">Feed</h1>
        <p className="text-gray-600 text-sm">Actividad de las personas que sigues</p>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {mockFeedItems.map((item, index) => (
          <Card 
            key={item.id} 
            className="border-orange-100 transition-all duration-200 hover:shadow-md hover:border-orange-200 animate-in fade-in-0 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-3 sm:p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                  <AvatarFallback>{item.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-orange-700 text-sm sm:text-base truncate">{item.user.name}</span>
                    <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">{item.user.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span>{item.action}</span>
                    <Badge className={`${getTypeColor(item.item.type)} text-xs`}>
                      {getTypeLabel(item.item.type)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">{item.timestamp}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-18 sm:w-16 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.item.image || "/placeholder.svg"} 
                    alt={item.item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-orange-700 mb-1 text-sm sm:text-base truncate">{item.item.title}</h3>
                  
                  {item.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs sm:text-sm text-gray-600">Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= item.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {item.listName && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.listName}
                      </Badge>
                    </div>
                  )}

                  {item.comment && (
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {item.comment}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 p-1 h-auto">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-xs">{item.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 p-1 h-auto">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">{item.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 p-1 h-auto">
                    <Share className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline ml-1">Compartir</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50 text-xs px-2 py-1 h-auto">
                  <User className="w-3 h-3 mr-1" />
                  Seguir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
          Cargar más actividad
        </Button>
      </div>
    </div>
  )
}
