"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { List, Star, MessageSquare, UserPlus } from "lucide-react"
import { ContentCard } from "@/components/content-card"
import { ReviewCard } from "@/components/review-card"
import { UserActivityCard } from "@/components/user-activity-card"
import { ListOverviewCard } from "@/components/list-overview-card"
import { useState } from "react"
import { CreateListModal } from "@/components/create-list-modal"
import { InviteFriendsModal } from "@/components/invite-friends-modal"

export function ProfileSection() {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false)
  const [isInviteFriendsModalOpen, setIsInviteFriendsModalOpen] = useState(false)

  // Mock data for profile
  const user = {
    name: "Jane Doe",
    username: "@janedoe",
    bio: "Cinephile, bookworm, and series binger. Sharing my thoughts on all things media!",
    avatar: "/placeholder-user.jpg",
    followers: 1234,
    following: 567,
  }

  const recentActivity = [
    {
      type: "review",
      content: "Pulp Fiction",
      rating: 5,
      text: "Still a masterpiece! The dialogue is just unmatched.",
      date: "2 days ago",
    },
    { type: "list", content: "Top 10 Sci-Fi Movies", items: 10, date: "1 week ago" },
    { type: "rating", content: "Dune: Part Two", rating: 4.5, date: "3 days ago" },
    {
      type: "review",
      content: "The Midnight Library",
      rating: 4,
      text: "A thought-provoking read about life choices.",
      date: "4 days ago",
    },
  ]

  const userLists = [
    {
      id: "1",
      name: "Películas Favoritas",
      description: "Mis películas imprescindibles de todos los tiempos.",
      items: 15,
      type: "movie",
    },
    {
      id: "2",
      name: "Libros para el Verano",
      description: "Lecturas ligeras y emocionantes para la temporada.",
      items: 8,
      type: "book",
    },
    {
      id: "3",
      name: "Series que Recomiendo",
      description: "Series que no te puedes perder.",
      items: 12,
      type: "series",
    },
  ]

  const userReviews = [
    {
      id: "r1",
      contentTitle: "Oppenheimer",
      contentType: "movie",
      rating: 4.5,
      text: "Una película intensa y visualmente impresionante. Cillian Murphy está espectacular.",
      date: "2024-07-20",
    },
    {
      id: "r2",
      contentTitle: "Cien años de soledad",
      contentType: "book",
      rating: 5,
      text: "Una obra maestra de la literatura. La narrativa es mágica y envolvente.",
      date: "2024-07-15",
    },
    {
      id: "r3",
      contentTitle: "Breaking Bad",
      contentType: "series",
      rating: 5,
      text: "Simplemente la mejor serie de la historia. Cada temporada es una joya.",
      date: "2024-07-10",
    },
  ]

  const userRatings = [
    {
      id: "rt1",
      contentTitle: "Spider-Man: Across the Spider-Verse",
      contentType: "movie",
      rating: 5,
      date: "2024-07-22",
    },
    {
      id: "rt2",
      contentTitle: "El Señor de los Anillos: La Comunidad del Anillo",
      contentType: "movie",
      rating: 5,
      date: "2024-07-18",
    },
    { id: "rt3", contentTitle: "Dune (Libro)", contentType: "book", rating: 4.5, date: "2024-07-12" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 bg-dark-background text-dark-foreground min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-dark-primary shadow-lg">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="bg-dark-accent text-dark-primary text-3xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-dark-primary">{user.name}</h1>
          <p className="text-dark-muted-foreground text-lg">{user.username}</p>
          <p className="mt-2 text-dark-foreground max-w-prose">{user.bio}</p>
          <div className="flex justify-center md:justify-start gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-dark-primary">{user.followers}</span>
              <span className="text-dark-muted-foreground">Seguidores</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-dark-primary">{user.following}</span>
              <span className="text-dark-muted-foreground">Siguiendo</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            <Button className="bg-dark-primary text-dark-primary-foreground hover:bg-dark-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Seguir
            </Button>
            <Button
              variant="outline"
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Mensaje
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-dark-border" />

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-dark-card border-dark-border">
          <TabsTrigger
            value="activity"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Actividad
          </TabsTrigger>
          <TabsTrigger
            value="lists"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Listas
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Reseñas
          </TabsTrigger>
          <TabsTrigger
            value="ratings"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Calificaciones
          </TabsTrigger>
          <TabsTrigger
            value="watched"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Visto/Leído
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Actividad Reciente</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* {recentActivity.map((activity, index) => (
              <UserActivityCard key={index} activity={activity} />
            ))} */}
          </div>
        </TabsContent>

        <TabsContent value="lists" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-dark-primary">Mis Listas</h2>
            <Button
              onClick={() => setIsCreateListModalOpen(true)}
              className="bg-dark-secondary text-dark-secondary-foreground hover:bg-dark-secondary/90"
            >
              <List className="mr-2 h-4 w-4" />
              Crear Nueva Lista
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* {userLists.map((list) => (
              <ListOverviewCard key={list.id} list={list} />
            ))} */}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Mis Reseñas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* {userReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))} */}
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Mis Calificaciones</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userRatings.map((rating) => (
              <Card key={rating.id} className="bg-dark-card border-dark-border text-dark-foreground">
                <CardHeader>
                  <CardTitle className="text-dark-primary">{rating.contentTitle}</CardTitle>
                  <CardDescription className="text-dark-muted-foreground">{rating.contentType}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold">{rating.rating}</span>
                  <span className="text-dark-muted-foreground text-sm ml-auto">{rating.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="watched" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Contenido Visto/Leído</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Placeholder for watched/read content */}
            {/* <ContentCard
              content={{
                id: "w1",
                title: "Inception",
                type: "MOVIE",
                imageUrl: "/placeholder.svg?height=300&width=200",
                rating: 4.8,
              }}
            />
            <ContentCard
              content={{
                id: "w2",
                title: "1984",
                type: "book",
                imageUrl: "/placeholder.svg?height=300&width=200",
                rating: 4.5,
              }}
            />
            <ContentCard
              content={{
                id: "w3",
                title: "The Queen's Gambit",
                type: "series",
                imageUrl: "/placeholder.svg?height=300&width=200",
                rating: 4.7,
              }}
            /> */}
          </div>
        </TabsContent>
      </Tabs>

      <CreateListModal open={isCreateListModalOpen} onOpenChange={setIsCreateListModalOpen} />
      <InviteFriendsModal open={isInviteFriendsModalOpen} onOpenChange={setIsInviteFriendsModalOpen} />
    </div>
  )
}
