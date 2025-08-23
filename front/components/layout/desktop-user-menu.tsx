"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DesktopUserMenuProps {
  notifications?: number
  onLogout?: () => void
  onProfileClick?: () => void
}

const ACCOUNT_URL = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/account/`

export function DesktopUserMenu({ notifications = 0, onLogout, onProfileClick }: DesktopUserMenuProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="relative text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
      >
        <Bell className="h-5 w-5" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {notifications}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback className="bg-dark-accent text-dark-primary">JD</AvatarFallback>
            </Avatar>
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-dark-card border-dark-border text-dark-foreground">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer hover:bg-dark-accent"
            onClick={() => {
              if (onProfileClick) onProfileClick();
              router.push("/profile");
            }}
          >
            <User className="h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer hover:bg-dark-accent">
            <a href={ACCOUNT_URL} target="_blank" rel="noopener noreferrer">
              <Settings className="h-4 w-4" />
              Cuenta
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-dark-border" />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-dark-destructive hover:bg-dark-destructive/20"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
