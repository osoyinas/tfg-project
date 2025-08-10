'use client'

import { useState } from 'react'
import { ArrowLeft, Star, Heart, Bookmark, Share, Plus, Play, Calendar, Clock, Users } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { ScrollArea } from '@components/ui/scroll-area'
import { Separator } from '@components/ui/separator'

const mockMovieData = {
  id: 1,
  title: "Oppenheimer",
  year: 2023,
  duration: "3h 0min",
  genre: ["Drama", "Historia", "Biografía"],
  rating: 4.5,
  userRating: null,
  director: "Christopher Nolan",
  cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr.", "Matt Damon"],
  synopsis: "La historia de J. Robert Oppenheimer, el físico teórico que dirigió el Proyecto Manhattan durante la Segunda Guerra Mundial, llevando al desarrollo de la primera bomba atómica.",
  image: "/placeholder.svg?height=600&width=400&text=Oppenheimer",
  backdrop: "/placeholder.svg?height=300&width=800&text=Oppenheimer+Backdrop",
  inLists: false,
  isLiked: false,
  isWatched: false
}

const mockSimilarItems = [
  { id: 2, title: "Dunkirk", type: "movie", rating: 4.3, image: "/placeholder.svg?height=150&width=100&text=Dunkirk" },
  { id: 3, title: "Interstellar", type: "movie", rating: 4.6, image: "/placeholder.svg?height=150&width=100&text=Interstellar" },
  { id: 4, title: "The Theory of Everything", type: "movie", rating: 4.2, image: "/placeholder.svg?height=150&width=100&text=Theory" },
  { id: 5, title: "American Prometheus", type: "book", rating: 4.4, image: "/placeholder.svg?height=150&width=100&text=Prometheus" }
]

const mockReviews = [
  {
    id: 1,
    user: { name: "Carlos López", username: "@carlos_cine", avatar: "/placeholder.svg?height=40&width=40&text=CL" },
    rating: 5,
    comment: "Una obra maestra cinematográfica. Nolan logra crear una experiencia visual y narrativa impresionante sobre uno de los momentos más importantes de la historia.",
    date: "hace 2 días",
    likes: 24
  },
  {
    id: 2,
    user: { name: "Ana Martín", username: "@ana_movies", avatar: "/placeholder.svg?height=40&width=40&text=AM" },
    rating: 4,
    comment: "Excelente actuación de Cillian Murphy. La cinematografía es espectacular, aunque a veces se siente un poco lenta.",
    date: "hace 1 semana",
    likes: 12
  }
]

const mockFriendsActivity = [
  { user: { name: "María García", avatar: "/placeholder.svg?height=32&width=32&text=MG" }, rating: 5, action: "calificó" },
  { user: { name: "Luis Rodríguez", avatar: "/placeholder.svg?height=32&width=32&text=LR" }, rating: 4, action: "vio" },
  { user: { name: "Elena Sánchez", avatar: "/placeholder.svg?height=32&width=32&text=ES" }, rating: 5, action: "agregó a su lista" }
]

interface MovieDetailProps {
  movieId: number
  onBack: () => void
  className?: string
}

export function MovieDetail({ movieId, onBack, className }: MovieDetailProps) {
  const [userRating, setUserRating] = useState<number | null>(mockMovieData.userRating)
  const [isLiked, setIsLiked] = useState(mockMovieData.isLiked)
  const [inLists, setInLists] = useState(mockMovieData.inLists)

  const handleRating = (rating: number) => {
    setUserRating(rating === userRating ? null : rating)
  }

  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img 
            src={mockMovieData.backdrop || "/placeholder.svg"} 
            alt={mockMovieData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-48 aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={mockMovieData.image || "/placeholder.svg"} 
              alt={mockMovieData.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-red-700 mb-2">{mockMovieData.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {mockMovieData.year}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {mockMovieData.duration}
                </span>
                <span>Dir. {mockMovieData.director}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {mockMovieData.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-red-100 text-red-700">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{mockMovieData.rating}</span>
                  <span className="text-sm text-gray-500">(1,234 ratings)</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Tu calificación:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="transition-colors"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= (userRating || 0) ? 'fill-red-400 text-red-400' : 'text-gray-300 hover:text-red-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm" 
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Te gusta' : 'Me gusta'}
              </Button>
              <Button 
                variant={inLists ? "default" : "outline"} 
                size="sm"
                onClick={() => setInLists(!inLists)}
                className={inLists ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${inLists ? 'fill-current' : ''}`} />
                {inLists ? 'En lista' : 'Agregar a lista'}
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Share className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-700">Sinopsis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{mockMovieData.synopsis}</p>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Reparto:</p>
            <p className="text-sm text-gray-600">{mockMovieData.cast.join(', ')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Friends Activity */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Actividad de Amigos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockFriendsActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="text-sm font-medium">{activity.user.name}</span>
                  <span className="text-sm text-gray-600 ml-1">{activity.action}</span>
                  {activity.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-3 h-3 ${star <= activity.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Similar Content */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-700">Contenido Similar</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-2">
              {mockSimilarItems.map((item) => (
                <div key={item.id} className="min-w-[120px] cursor-pointer group">
                  <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-sm truncate">{item.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{item.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.type === 'movie' ? 'Película' : 'Libro'}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-700">Reseñas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockReviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.user.name}</span>
                    <span className="text-xs text-gray-500">{review.user.username}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{review.comment}</p>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 p-0 h-auto">
                    <Heart className="w-4 h-4 mr-1" />
                    {review.likes}
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
