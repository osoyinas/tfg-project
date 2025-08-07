'use client'

import { useState } from 'react'
import { TopBar } from '@/components/top-bar'
import { BottomNavigation } from '@/components/bottom-navigation'
import { MoviesSection } from '@/components/movies-section'
import { BooksSection } from '@/components/books-section'
import { SeriesSection } from '@/components/series-section'
import { FeedSection } from '@/components/feed-section'
import { ProfileSection } from '@/components/profile-section'
import { MovieDetail } from '@/components/movie-detail'
import { BookDetail } from '@/components/book-detail'
import { SeriesDetail } from '@/components/series-detail'
import { ListsSection } from '@/components/lists-section'
import { ListDetail } from '@/components/list-detail'

export default function Home() {
  const [activeSection, setActiveSection] = useState('movies')
  const [selectedItem, setSelectedItem] = useState<{type: string, id: number} | null>(null)

  const handleItemSelect = (type: string, id: number) => {
    setSelectedItem({ type, id })
  }

  const handleBackToSection = () => {
    setSelectedItem(null)
  }

  const renderSection = () => {
    const className = "animate-in fade-in-0 slide-in-from-bottom-2 duration-300"

    // Show detail view if item is selected
    if (selectedItem) {
      switch (selectedItem.type) {
        case 'movie':
          return <MovieDetail key={`movie-${selectedItem.id}`} movieId={selectedItem.id} onBack={handleBackToSection} className={className} />
        case 'book':
          return <BookDetail key={`book-${selectedItem.id}`} bookId={selectedItem.id} onBack={handleBackToSection} className={className} />
        case 'series':
          return <SeriesDetail key={`series-${selectedItem.id}`} seriesId={selectedItem.id} onBack={handleBackToSection} className={className} />
        case 'list':
          return <ListDetail key={`list-${selectedItem.id}`} listId={selectedItem.id} onBack={handleBackToSection} className={className} />
        default:
          return null
      }
    }

    // Show main sections
    switch (activeSection) {
      case 'movies':
        return <MoviesSection key={activeSection} className={className} onItemSelect={handleItemSelect} />
      case 'books':
        return <BooksSection key={activeSection} className={className} onItemSelect={handleItemSelect} />
      case 'series':
        return <SeriesSection key={activeSection} className={className} onItemSelect={handleItemSelect} />
      case 'feed':
        return <FeedSection key={activeSection} className={className} />
      case 'profile':
        return <ProfileSection key={activeSection} className={className} />
      case 'lists':
        return <ListsSection key={activeSection} className={className} onItemSelect={handleItemSelect} />
      default:
        return <MoviesSection key={activeSection} className={className} onItemSelect={handleItemSelect} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar onSectionChange={setActiveSection} />
      <div className="pt-16 pb-20 min-h-screen">
        {renderSection()}
      </div>
      <BottomNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  )
}
