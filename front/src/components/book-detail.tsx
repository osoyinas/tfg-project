'use client'

import { useState } from 'react'
import { ArrowLeft, Star, Heart, Bookmark, Share, Calendar, BookOpen, Users } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { ScrollArea } from '@components/ui/scroll-area'
import { Separator } from '@components/ui/separator'

const mockBookData = {
  id: 1,
  title: "Fourth Wing",
  author: "Rebecca Yarros",
  year: 2023,
  pages: 512,
  genre: ["Fantasía", "Romance", "Ficción"],
  rating: 4.6,
  userRating: null,
  publisher: "Red Tower Books",
  isbn: "978-1649374042",
  synopsis: "Violet Sorrengail pensaba que se uniría al Cuadrante de Escribas para vivir una vida tranquila entre libros y historia. Ahora, el comandante general —también conocido como su madre despiadada— la ha ordenado unirse a los cientos de candidatos que luchan por convertirse en los jinetes de élite de Navarre. Pero cuando eres más pequeña que el resto de tu clase y tu cuerpo es frágil, la muerte acecha en cada esquina, porque los dragones no se vinculan con humanos 'frágiles'. Tienen la tendencia a... incinerarlos.",
  image: "/placeholder.svg?height=600&width=400&text=Fourth+Wing",
  inLists: false,
  isLiked: false,
  isRead: false
}

const mockSimilarItems = [
  { id: 2, title: "Iron Flame", type: "book", rating: 4.5, image: "/placeholder.svg?height=150&width=100&text=Iron+Flame" },
  { id: 3, title: "A Court of Thorns and Roses", type: "book", rating: 4.3, image: "/placeholder.svg?height=150&width=100&text=ACOTAR" },
  { id: 4, title: "House of the Dragon", type: "series", rating: 4.2, image: "/placeholder.svg?height=150&width=100&text=HOTD" },
  { id: 5, title: "The Cruel Prince", type: "book", rating: 4.4, image: "/placeholder.svg?height=150&width=100&text=Cruel+Prince" }
]

const mockReviews = [
  {
    id: 1,
    user: { name: "María García", username: "@maria_reads", avatar: "/placeholder.svg?height=40&width=40&text=MG" },
    rating: 5,
    comment: "¡Increíble libro! No pude parar de leer. Los dragones y la academia militar están perfectamente desarrollados. La química entre Violet y Xaden es explosiva.",
    date: "hace 3 días",
    likes: 18
  },
  {
    id: 2,
    user: { name: "Elena Sánchez", username: "@elena_fantasy", avatar: "/placeholder.svg?height=40&width=40&text=ES" },
    rating: 4,
    comment: "Una fantasía adictiva con mucha acción. Aunque algunos tropos son predecibles, la ejecución es excelente. Ya estoy esperando la secuela.",
    date: "hace 1 semana",
    likes: 9
  }
]

const mockFriendsActivity = [
  { user: { name: "Ana Martín", avatar: "/placeholder.svg?height=32&width=32&text=AM" }, rating: 5, action: "calificó" },
  { user: { name: "Carlos López", avatar: "/placeholder.svg?height=32&width=32&text=CL" }, rating: 4, action: "leyó" },
  { user: { name: "Luis Rodríguez", avatar: "/placeholder.svg?height=32&width=32&text=LR" }, rating: 5, action: "agregó a su lista" }
]

interface BookDetailProps {
  bookId: number
  onBack: () => void
  className?: string
}

export function BookDetail({ bookId, onBack, className }: BookDetailProps) {
  const [userRating, setUserRating] = useState<number | null>(mockBookData.userRating)
  const [isLiked, setIsLiked] = useState(mockBookData.isLiked)
  const [inLists, setInLists] = useState(mockBookData.inLists)

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
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-48 aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={mockBookData.image || "/placeholder.svg"} 
            alt={mockBookData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">{mockBookData.title}</h1>
            <p className="text-lg text-gray-700 mb-3">por {mockBookData.author}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {mockBookData.year}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {mockBookData.pages} páginas
              </span>
              <span>{mockBookData.publisher}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {mockBookData.genre.map((g) => (
                <Badge key={g} variant="secondary" className="bg-green-100 text-green-700">
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
                <span className="text-lg font-semibold">{mockBookData.rating}</span>
                <span className="text-sm text-gray-500">(2,847 ratings)</span>
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
                      className={`w-6 h-6 ${star <= (userRating || 0) ? 'fill-green-400 text-green-400' : 'text-gray-300 hover:text-green-300'}`}
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
              className={isLiked ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-600 hover:bg-green-50"}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Te gusta' : 'Me gusta'}
            </Button>
            <Button 
              variant={inLists ? "default" : "outline"} 
              size="sm"
              onClick={() => setInLists(!inLists)}
              className={inLists ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-600 hover:bg-green-50"}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${inLists ? 'fill-current' : ''}`} />
              {inLists ? 'En lista' : 'Leer después'}
            </Button>
            <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
              <Share className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-700">Sinopsis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{mockBookData.synopsis}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>ISBN:</strong> {mockBookData.isbn}</p>
          </div>
        </CardContent>
      </Card>

      {/* Friends Activity */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2">
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
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-700">Contenido Similar</CardTitle>
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
                    {item.type === 'book' ? 'Libro' : 'Serie'}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-700">Reseñas</CardTitle>
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
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 p-0 h-auto">
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
