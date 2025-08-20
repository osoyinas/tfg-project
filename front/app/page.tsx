'use client'
import { TopBar } from "@/components/top-bar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FeedSection } from "@/components/feed-section"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/movies")
  }, [])
  return (
    <div className="flex min-h-screen flex-col bg-dark-background text-dark-foreground">
      <main className="flex-1 pb-16 md:pb-0">
        <FeedSection />
      </main>
      <BottomNavigation />
    </div>
  )
}
