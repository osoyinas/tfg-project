"use client"

import { Button } from "@/components/ui/button"

interface DesktopAuthButtonsProps {
  onLogin?: () => void
  onRegister?: () => void
}

export function DesktopAuthButtons({ onLogin, onRegister }: DesktopAuthButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={onLogin}
        className="text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
      >
        Iniciar Sesión
      </Button>
    </div>
  )
}
