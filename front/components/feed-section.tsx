"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentCard } from "@/components/content-card"
import { UserActivityCard } from "@/components/user-activity-card"
import { cn } from "@/lib/utils"

export function FeedSection() {
  const [activeTab, setActiveTab] = useState("for-you")

  const forYouContent = [
    { id: "1", title: "Dune: Part Two", type: "movie", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.8 },
    {
      id: "2",
      title: "Project Hail Mary",
      type: "book",
      imageUrl: "/placeholder.svg?height=300&width=200",
      rating: 4.7,
    },
    { id: "3", title: "Breaking Bad", type: "series", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.9 },
    { id: "4", title: "Past Lives", type: "movie", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.5 },
    { id: "5", title: "Atomic Habits", type: "book", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.5 },
  ]

  const friendsActivity = [
    { type: "review", content: "Oppenheimer", rating: 5, text: "Mind-blowing!", date: "1 hour ago" },
    { type: "rating", content: "The Midnight Library", rating: 4, date: "3 hours ago" },
    { type: "list", content: "Top Sci-Fi Movies", items: 10, date: "1 day ago" },
    { type: "review", content: "Squid Game", rating: 4.5, text: "Couldn't stop watching!", date: "2 days ago" },
  ]

  const globalActivity = [
    { type: "review", content: "Dune: Part Two", rating: 5, text: "A cinematic masterpiece!", date: "5 minutes ago" },
    { type: "rating", content: "The Lord of the Rings", rating: 5, date: "10 minutes ago" },
    { type: "list", content: "Best Fantasy Books", items: 20, date: "30 minutes ago" },
    { type: "review", content: "Chernobyl", rating: 5, text: "Haunting and powerful.", date: "1 hour ago" },
  ]

  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 min-h-screen transition-colors duration-500",
        "bg-dark-background text-dark-foreground",
      )}
    >
      <h1 className="text-4xl font-bold mb-8 text-feed-orange">Feed</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-dark-card border-dark-border">
          <TabsTrigger
            value="for-you"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Para Ti
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Amigos
          </TabsTrigger>
          <TabsTrigger
            value="global"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Global
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Recomendaciones para ti</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {/* {forYouContent.map((content) => (
              
))} */}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Actividad de Amigos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* {friendsActivity.map((activity, index) => (
              <UserActivityCard key={index} activity={activity} />
            ))} */}
          </div>
        </TabsContent>

        <TabsContent value="global" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Actividad Global</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* {globalActivity.map((activity, index) => (
              <UserActivityCard key={index} activity={activity} />
            ))} */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
