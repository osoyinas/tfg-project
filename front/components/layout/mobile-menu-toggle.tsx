"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { MobileNavContent } from "./mobile-nav-content"
import { useState } from "react"

interface MobileMenuToggleProps {
  isLoggedIn?: boolean
  notifications?: number
  onLogin?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
}

export function MobileMenuToggle({
  isLoggedIn,
  notifications,
  onLogin,
  onLogout,
  onProfileClick,
}: MobileMenuToggleProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-dark-card border-dark-border p-0">
        <MobileNavContent
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          onLogin={onLogin}
          onLogout={onLogout}
          onProfileClick={onProfileClick}
          onCloseMenu={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
