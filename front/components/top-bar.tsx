"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LogoAndBrand } from "./layout/logo-and-brand"
import { DesktopAuthButtons } from "./layout/desktop-auth-buttons"
import { DesktopUserMenu } from "./layout/desktop-user-menu"
import { MobileMenuToggle } from "./layout/mobile-menu-toggle"
import { useState } from "react"
import { SearchModal } from "./search-modal"

export function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from auth context
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-dark-card py-3 shadow-sm">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <MobileMenuToggle />
            <LogoAndBrand />
          </div>
          <div className="relative flex-1 max-w-md mx-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-dark-primary focus:ring-dark-primary text-dark-foreground placeholder:text-dark-muted-foreground"
              onClick={() => setIsSearchModalOpen(true)}
              readOnly
            />
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? <DesktopUserMenu /> : <DesktopAuthButtons />}
          </div>
        </div>
      </header>
      <SearchModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </>
  )
}
