'use client'

import { useState } from 'react'
import { ArrowLeft, Heart, MessageCircle, Share, Plus, Users, Globe, Lock, Edit, UserPlus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { InviteFriendsModal } from '@/components/invite-friends-modal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mockListData = {
  id: 1,
  title: "Mis Favoritos de Fantasía",
  description: "Una colección curada de mis libros y series de fantasía favoritos. Desde clásicos como El Señor de los Anillos hasta nuevas joyas como Fourth Wing.",
  author: { name: "María García", username: "@maria_reads", avatar: "/placeholder.svg?height=40&width=40&text=MG" },
  image: "/placeholder.svg?height=300&width=800&text=Fantasy+Collection",
  isPublic: true,
  allowCollaborators: true,
  likes: 24,
  comments: 8,
  followers: 156,
  created: "15 de diciembre, 2023",
  lastUpdated: "hace 2 días",
  isOwner: true,
  isFollowing: false,
  isLiked: false
}

const mockListItems = [
  {
    id: 1,
    title: "Fourth Wing",
    type: "book",
    author: "Rebecca Yarros",
    rating: 4.6,
    image: "/placeholder.svg?height=120&width=80&text=Fourth+Wing",
    addedBy: { name: "María García", avatar: "/placeholder.svg?height=24&width=24&text=MG" },
    addedDate: "hace 3 días"
  },
  {
    id: 2,
    title: "House of the Dragon",
    type: "series",
    year: 2022,
    rating: 4.5,
    image: "/placeholder.svg?height=120&width=80&text=HOTD",
    addedBy: { name: "Carlos López", avatar: "/placeholder.svg?height=24&width=24&text=CL" },
    addedDate: "hace 1 semana"
  },
  {
    id: 3,
    title: "The Name of the Wind",
    type: "book",
    author: "Patrick Rothfuss",
    rating: 4.3,
    image: "/placeholder.svg?height=120&width=80&text=Name+Wind",
    addedBy: { name: "María García", avatar: "/placeholder.svg?height=24&width=24&text=MG" },
    addedDate: "hace 2 semanas"
  }
]

const mockComments = [
  {
    id: 1,
    user: { name: "Ana Martín", username: "@ana_fantasy", avatar: "/placeholder.svg?height=32&width=32&text=AM" },
    comment: "¡Excelente selección! Me encanta que hayas incluido Fourth Wing, es una joya. ¿Has considerado agregar The Priory of the Orange Tree?",
    date: "hace 1 día",
    likes: 5
  },
  {
    id: 2,
    user: { name: "Luis Rodríguez", username: "@luis_books", avatar: "/placeholder.svg?height=32&width=32&text=LR" },
    comment: "Siguiendo esta lista. Necesito más fantasía en mi vida 📚✨",
    date: "hace 3 días",
    likes: 2
  }
]

const mockCollaborators = [
  { name: "Carlos López", username: "@carlos_fantasy", avatar: "/placeholder.svg?height=32&width=32&text=CL" },
  { name: "Elena Sánchez", username: "@elena_reads", avatar: "/placeholder.svg?height=32&width=32&text=ES" }
]

interface ListDetailProps {
  listId: number
  onBack: () => void
  className?: string
}

export function ListDetail({ listId, onBack, className }: ListDetailProps) {
  const [isLiked, setIsLiked] = useState(mockListData.isLiked)
  const [isFollowing, setIsFollowing] = useState(mockListData.isFollowing)
  const [newComment, setNewComment] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('Adding comment:', newComment)
      setNewComment('')
    }
  }

  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Listas
      </Button>

      {/* Header */}
      <div className="relative">
        <div className="aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden mb-6">
          <img 
            src={mockListData.image || "/placeholder.svg"} 
            alt={mockListData.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">{mockListData.title}</h1>
                <div className="flex items-center gap-2">
                  {mockListData.isPublic ? (
                    <Globe className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  {mockListData.allowCollaborators && (
                    <Users className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={mockListData.author.avatar || "/placeholder.svg"} alt={mockListData.author.name} />
                  <AvatarFallback>{mockListData.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-sm">{mockListData.author.name}</span>
                  <span className="text-gray-500 text-sm ml-1">{mockListData.author.username}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">{mockListData.created}</span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{mockListData.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{mockListItems.length} elementos</span>
                <span>{mockListData.followers} seguidores</span>
                <span>Actualizada {mockListData.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {mockListData.isOwner ? (
                <>
                  <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  {mockListData.allowCollaborators && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invitar
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={isFollowing ? "border-purple-200 text-purple-600 hover:bg-purple-50" : "bg-purple-600 hover:bg-purple-700"}
                >
                  {isFollowing ? 'Siguiendo' : 'Seguir Lista'}
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Compartir
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Reportar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsLiked(!isLiked)}
              className={`text-gray-600 hover:text-purple-600 p-0 h-auto ${isLiked ? 'text-purple-600' : ''}`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {mockListData.likes + (isLiked ? 1 : 0)} likes
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600 p-0 h-auto">
              <MessageCircle className="w-5 h-5 mr-2" />
              {mockListData.comments} comentarios
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600 p-0 h-auto">
              <Share className="w-5 h-5 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Collaborators */}
      {mockListData.allowCollaborators && mockCollaborators.length > 0 && (
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-700 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Colaboradores ({mockCollaborators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 flex-wrap">
              {mockCollaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                    <AvatarFallback className="text-xs">{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{collaborator.name}</p>
                    <p className="text-xs text-gray-500">{collaborator.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Items */}
      <Card className="border-purple-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-700">Elementos de la Lista ({mockListItems.length})</CardTitle>
            {(mockListData.isOwner || mockListData.allowCollaborators) && (
              <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockListItems.map((item, index) => (
            <div key={item.id} className="space-y-3">
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
                      <p className="text-xs sm:text-sm text-gray-600">
                        {item.type === 'book' ? `por ${item.author}` : item.year}
                      </p>
                    </div>
                    <Badge className={`${getTypeColor(item.type)} ml-2 flex-shrink-0`}>
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-medium">⭐ {item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={item.addedBy.avatar || "/placeholder.svg"} alt={item.addedBy.name} />
                          <AvatarFallback className="text-xs">{item.addedBy.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">por {item.addedBy.name}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{item.addedDate}</span>
                  </div>
                </div>
              </div>
              {index < mockListItems.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-700">Comentarios ({mockComments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Comentar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          {mockComments.map((comment, index) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-gray-500">{comment.user.username}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{comment.comment}</p>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600 p-0 h-auto">
                    <Heart className="w-4 h-4 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
              {index < mockComments.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Invite Friends Modal */}
      <InviteFriendsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)}
        listTitle={mockListData.title}
      />
    </div>
  )
}
