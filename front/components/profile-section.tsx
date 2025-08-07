'use client'

import { useState } from 'react'
import { Star, Heart, Users, BookOpen, Film, Tv, Settings, Edit, UserPlus, UserMinus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

const mockUserData = {
  name: "María García",
  username: "@maria_reads",
  avatar: "/placeholder.svg?height=80&width=80&text=MG",
  bio: "Amante de los libros de fantasía y las películas de ciencia ficción. Siempre buscando la próxima gran historia.",
  stats: {
    followers: 234,
    following: 156,
    ratings: 89,
    lists: 12
  },
  recentRatings: [
    {
      id: 1,
      title: "Fourth Wing",
      type: "book",
      rating: 5,
      image: "/placeholder.svg?height=60&width=40&text=FW",
      date: "hace 2 días"
    },
    {
      id: 2,
      title: "Oppenheimer",
      type: "movie",
      rating: 4,
      image: "/placeholder.svg?height=60&width=40&text=OP",
      date: "hace 1 semana"
    },
    {
      id: 3,
      title: "The Last of Us",
      type: "series",
      rating: 5,
      image: "/placeholder.svg?height=60&width=40&text=TLOU",
      date: "hace 2 semanas"
    }
  ]
}

const mockFollowing = [
  {
    id: 1,
    name: "Carlos López",
    username: "@carlos_cine",
    avatar: "/placeholder.svg?height=40&width=40&text=CL",
    mutualFollowers: 12,
    isFollowing: true
  },
  {
    id: 2,
    name: "Ana Martín",
    username: "@ana_series",
    avatar: "/placeholder.svg?height=40&width=40&text=AM",
    mutualFollowers: 8,
    isFollowing: true
  },
  {
    id: 3,
    name: "Luis Rodríguez",
    username: "@luis_books",
    avatar: "/placeholder.svg?height=40&width=40&text=LR",
    mutualFollowers: 5,
    isFollowing: true
  }
]

const mockFollowers = [
  {
    id: 4,
    name: "Elena Sánchez",
    username: "@elena_reads",
    avatar: "/placeholder.svg?height=40&width=40&text=ES",
    mutualFollowers: 15,
    isFollowing: false
  },
  {
    id: 5,
    name: "David Torres",
    username: "@david_movies",
    avatar: "/placeholder.svg?height=40&width=40&text=DT",
    mutualFollowers: 3,
    isFollowing: true
  },
  {
    id: 6,
    name: "Carmen Ruiz",
    username: "@carmen_series",
    avatar: "/placeholder.svg?height=40&width=40&text=CR",
    mutualFollowers: 7,
    isFollowing: false
  }
]

interface ProfileSectionProps {
  className?: string
}

export function ProfileSection({ className }: ProfileSectionProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="w-3 h-3 text-red-500" />
      case 'book': return <BookOpen className="w-3 h-3 text-green-500" />
      case 'series': return <Tv className="w-3 h-3 text-blue-500" />
      default: return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'border-red-100'
      case 'book': return 'border-green-100'
      case 'series': return 'border-blue-100'
      default: return 'border-gray-100'
    }
  }

  const handleFollowToggle = (userId: number, currentlyFollowing: boolean) => {
    // Mock follow/unfollow functionality
    console.log(`${currentlyFollowing ? 'Unfollowing' : 'Following'} user ${userId}`)
  }

  return (
    <div className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Profile Header */}
      <Card className="border-pink-100">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
              <AvatarImage src={mockUserData.avatar || "/placeholder.svg"} alt={mockUserData.name} />
              <AvatarFallback className="text-lg font-bold bg-pink-100 text-pink-700">
                {mockUserData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-pink-700">{mockUserData.name}</h1>
                  <p className="text-gray-600 text-sm">{mockUserData.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{mockUserData.bio}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-pink-700">{mockUserData.stats.followers}</div>
                  <div className="text-xs text-gray-600">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-pink-700">{mockUserData.stats.following}</div>
                  <div className="text-xs text-gray-600">Siguiendo</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-pink-700">{mockUserData.stats.ratings}</div>
                  <div className="text-xs text-gray-600">Ratings</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-pink-700">{mockUserData.stats.lists}</div>
                  <div className="text-xs text-gray-600">Listas</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-pink-50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-pink-700">
            Resumen
          </TabsTrigger>
          <TabsTrigger value="following" className="data-[state=active]:bg-white data-[state=active]:text-pink-700">
            Siguiendo
          </TabsTrigger>
          <TabsTrigger value="followers" className="data-[state=active]:bg-white data-[state=active]:text-pink-700">
            Seguidores
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-lg text-pink-700 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Ratings Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockUserData.recentRatings.map((rating, index) => (
                <div 
                  key={rating.id} 
                  className={`flex gap-3 p-3 rounded-lg border ${getTypeColor(rating.type)} transition-all duration-200 hover:shadow-sm animate-in fade-in-0 slide-in-from-left-4`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-15 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={rating.image || "/placeholder.svg"} 
                      alt={rating.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{rating.title}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        {getTypeIcon(rating.type)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-3 h-3 ${star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{rating.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Following Tab */}
        <TabsContent value="following" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-pink-700">Siguiendo ({mockFollowing.length})</h2>
          </div>
          
          <div className="space-y-3">
            {mockFollowing.map((user, index) => (
              <Card 
                key={user.id} 
                className="border-pink-100 transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-right-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-pink-700 truncate">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.mutualFollowers} seguidores en común</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={user.isFollowing ? "outline" : "default"}
                      className={user.isFollowing ? 
                        "border-pink-200 text-pink-600 hover:bg-pink-50" : 
                        "bg-pink-600 hover:bg-pink-700"
                      }
                      onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-1" />
                          Siguiendo
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Seguir
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Followers Tab */}
        <TabsContent value="followers" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-pink-700">Seguidores ({mockFollowers.length})</h2>
          </div>
          
          <div className="space-y-3">
            {mockFollowers.map((user, index) => (
              <Card 
                key={user.id} 
                className="border-pink-100 transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-left-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-pink-700 truncate">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.mutualFollowers} seguidores en común</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={user.isFollowing ? "outline" : "default"}
                      className={user.isFollowing ? 
                        "border-pink-200 text-pink-600 hover:bg-pink-50" : 
                        "bg-pink-600 hover:bg-pink-700"
                      }
                      onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-1" />
                          Siguiendo
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Seguir
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
