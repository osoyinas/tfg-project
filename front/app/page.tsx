import { TopBar } from "@/components/top-bar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FeedSection } from "@/components/feed-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-dark-background text-dark-foreground">
      <main className="flex-1 pb-16 md:pb-0">
        <FeedSection />
      </main>
      <BottomNavigation />
    </div>
  )
}
