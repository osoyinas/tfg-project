'use client'
import { LandingPage } from "@/components/landing/landing-page"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-dark-background text-dark-foreground">
      <main className="flex-1 pb-16 md:pb-0">
        <LandingPage />
      </main>
    </div>
  )
}
