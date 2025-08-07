'use client'

import { useState } from 'react'
import { Bell, Settings, User, Menu, X, LogIn, UserPlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SearchModal } from '@/components/search-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopBarProps {
  onSectionChange?: (section: string) => void
}

export function TopBar({ onSectionChange }: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Changed to true for demo
  const [notifications] = useState(3) // Mock notifications

  const handleProfileClick = () => {
    if (onSectionChange) {
      onSectionChange('profile')
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:block">RateIt</span>
          </div>

          {/* Search Button */}
          <div className="flex-1 max-w-md mx-4">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-500 border-gray-200 hover:bg-gray-50"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Buscar películas, libros, series...</span>
              <span className="sm:hidden">Buscar...</span>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="sm">
                  <Settings className="w-5 h-5" />
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=MG" alt="Usuario" />
                        <AvatarFallback>MG</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=MG" alt="Usuario" />
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">María García</p>
                      <p className="text-sm text-gray-500">@maria_reads</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => {
                      handleProfileClick()
                      setIsMenuOpen(false)
                    }}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Mi Perfil
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start relative" size="sm">
                    <Bell className="w-4 h-4 mr-3" />
                    Notificaciones
                    {notifications > 0 && (
                      <Badge className="ml-auto w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-3" />
                    Configuración
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                    size="sm"
                    onClick={() => {
                      setIsLoggedIn(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => {
                      setIsLoggedIn(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-3" />
                    Iniciar Sesión
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600" 
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
