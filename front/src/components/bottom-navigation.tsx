import { Film, Book, Tv, Home, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'movies', icon: Film, label: 'Películas', color: 'text-red-500' },
    { id: 'books', icon: Book, label: 'Libros', color: 'text-green-500' },
    { id: 'series', icon: Tv, label: 'Series', color: 'text-blue-500' },
    { id: 'lists', icon: List, label: 'Listas', color: 'text-purple-500' },
    { id: 'feed', icon: Home, label: 'Feed', color: 'text-orange-500' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive ? "bg-gray-100" : "hover:bg-gray-50"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 mb-1",
                  isActive ? item.color : "text-gray-400"
                )} 
              />
              <span className={cn(
                "text-xs font-medium",
                isActive ? item.color : "text-gray-400"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
