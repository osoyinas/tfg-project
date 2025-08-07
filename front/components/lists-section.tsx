'use client'

import { useState } from 'react'
import { Plus, List, Users, Globe, Share, Heart, MessageCircle, Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateListModal } from '@/components/create-list-modal'

const mockMyLists = [
  {
    id: 1,
    title: "Mis Favoritos de Fantasía",
    description: "Una colección de mis libros y series de fantasía favoritos",
    author: { name: "María García", username: "@maria_reads", avatar: "/placeholder.svg?height=32&width=32&text=MG" },
    image: "/placeholder.svg?height=200&width=300&text=Fantasy+List",
    itemCount: 12,
    isPublic: true,
    likes: 24,
    comments: 8,
    collaborators: 0,
    lastUpdated: "hace 2 días"
  },
  {
    id: 2,
    title: "Por Ver en 2024",
    description: "Películas y series que quiero ver este año",
    author: { name: "María García", username: "@maria_reads", avatar: "/placeholder.svg?height=32&width=32&text=MG" },
    image: "/placeholder.svg?height=200&width=300&text=Watchlist+2024",
    itemCount: 8,
    isPublic: false,
    likes: 0,
    comments: 0,
    collaborators: 2,
    lastUpdated: "hace 1 semana"
  }
]

const mockPublicLists = [
  {
    id: 3,
    title: "Los Mejores Thrillers Psicológicos",
    description: "Una selección curada de los mejores thrillers que te mantendrán despierto toda la noche",
    author: { name: "Carlos López", username: "@carlos_cine", avatar: "/placeholder.svg?height=32&width=32&text=CL" },
    image: "/placeholder.svg?height=200&width=300&text=Psychological+Thrillers",
    itemCount: 15,
    isPublic: true,
    likes: 156,
    comments: 23,
    collaborators: 0,
    lastUpdated: "hace 3 días"
  },
  {
    id: 4,
    title: "Clásicos que Debes Leer",
    description: "Literatura clásica esencial para cualquier amante de los libros",
    author: { name: "Elena Sánchez", username: "@elena_reads", avatar: "/placeholder.svg?height=32&width=32&text=ES" },
    image: "/placeholder.svg?height=200&width=300&text=Classic+Books",
    itemCount: 25,
    isPublic: true,
    likes: 89,
    comments: 12,
    collaborators: 1,
    lastUpdated: "hace 1 día"
  }
]

const mockSharedLists = [
  {
    id: 5,
    title: "Club de Lectura - Enero 2024",
    description: "Selecciones del club de lectura para este mes",
    author: { name: "Ana Martín", username: "@ana_books", avatar: "/placeholder.svg?height=32&width=32&text=AM" },
    image: "/placeholder.svg?height=200&width=300&text=Book+Club",
    itemCount: 4,
    isPublic: false,
    likes: 12,
    comments: 18,
    collaborators: 8,
    lastUpdated: "hace 5 horas",
    sharedBy: "Ana Martín"
  }
]

interface ListsSectionProps {
  className?: string
  onItemSelect?: (type: string, id: number) => void
}

export function ListsSection({ className, onItemSelect }: ListsSectionProps) {
  const [activeTab, setActiveTab] = useState('my-lists')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const renderListCard = (list: any, showAuthor = true) => (
    <Card 
      key={list.id} 
      className="border-purple-100 transition-all duration-200 hover:shadow-md hover:border-purple-200 cursor-pointer group"
      onClick={() => onItemSelect?.('list', list.id)}
    >
      <CardContent className="p-0">
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <img 
            src={list.image || "/placeholder.svg"} 
            alt={list.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-purple-700 truncate text-sm sm:text-base">{list.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{list.description}</p>
            </div>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {list.isPublic ? (
                <Globe className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {showAuthor && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={list.author.avatar || "/placeholder.svg"} alt={list.author.name} />
                <AvatarFallback className="text-xs">{list.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{list.author.name}</span>
              {list.sharedBy && (
                <Badge variant="outline" className="text-xs">
                  Compartida por {list.sharedBy}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <List className="w-3 h-3" />
                {list.itemCount} elementos
              </span>
              {list.collaborators > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {list.collaborators} colaboradores
                </span>
              )}
            </div>
            <span>{list.lastUpdated}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600 p-0 h-auto">
                <Heart className="w-4 h-4 mr-1" />
                <span className="text-xs">{list.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600 p-0 h-auto">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">{list.comments}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600 p-0 h-auto">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-purple-600">Listas</h1>
          <p className="text-gray-600 text-sm">Organiza y comparte tu contenido favorito</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Nueva Lista</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-purple-50">
          <TabsTrigger value="my-lists" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            Mis Listas
          </TabsTrigger>
          <TabsTrigger value="public-lists" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            Públicas
          </TabsTrigger>
          <TabsTrigger value="shared-lists" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            Compartidas
          </TabsTrigger>
        </TabsList>

        {/* My Lists Tab */}
        <TabsContent value="my-lists" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-700">Mis Listas ({mockMyLists.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMyLists.map((list) => renderListCard(list, false))}
          </div>
        </TabsContent>

        {/* Public Lists Tab */}
        <TabsContent value="public-lists" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-700">Listas Públicas</h2>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Descubre listas de la comunidad</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPublicLists.map((list) => renderListCard(list))}
          </div>
        </TabsContent>

        {/* Shared Lists Tab */}
        <TabsContent value="shared-lists" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-700">Compartidas Conmigo ({mockSharedLists.length})</h2>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Listas colaborativas</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSharedLists.map((list) => renderListCard(list))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create List Modal */}
      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  )
}
