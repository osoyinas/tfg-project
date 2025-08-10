"use client"

import Link from "next/link"
import { Home, Film, Book, Tv, List, Search, User, Bell, Settings, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LogoAndBrand } from "./logo-and-brand"

interface MobileNavContentProps {
  isLoggedIn?: boolean
  notifications?: number
  onLogin?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onCloseMenu?: () => void
}

export function MobileNavContent({
  isLoggedIn,
  notifications,
  onLogin,
  onLogout,
  onProfileClick,
  onCloseMenu,
}: MobileNavContentProps) {
  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/movies", icon: Film, label: "Películas" },
    { href: "/books", icon: Book, label: "Libros" },
    { href: "/series", icon: Tv, label: "Series" },
    { href: "/lists", icon: List, label: "Listas" }
  ]

  return (
    <div className="flex h-full flex-col py-4">
      <div className="px-4 pb-4">
        <LogoAndBrand />
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary transition-colors"
            onClick={onCloseMenu}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4">
        <Separator className="my-4 bg-dark-border" />
        {isLoggedIn ? (
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary"
              onClick={() => {
                onProfileClick?.();
                onCloseMenu?.();
              }}
              asChild
            >
              <Link href="/profile">
                <User className="mr-3 h-5 w-5" />
                Perfil
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary relative"
              onClick={onCloseMenu}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notificaciones
              {notifications && notifications > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notifications}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary"
              onClick={onCloseMenu}
              asChild
            >
              <Link href="/settings">
                <Settings className="mr-3 h-5 w-5" />
                Configuración
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-dark-destructive hover:bg-dark-destructive/20"
              onClick={() => {
                onLogout?.()
                onCloseMenu?.()
              }}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={onLogin}
              className="w-full bg-dark-primary text-dark-primary-foreground hover:bg-dark-primary/90"
            >
              Iniciar Sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
