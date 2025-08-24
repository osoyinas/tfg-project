"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LogoAndBrand } from "./layout/logo-and-brand";
import { DesktopAuthButtons } from "./layout/desktop-auth-buttons";
import { DesktopUserMenu } from "./layout/desktop-user-menu";
import { MobileMenuToggle } from "./layout/mobile-menu-toggle";
import { useKeycloak } from "@/components/keycloak-provider";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getMyProfileWithStats } from "@/services/profile";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { SearchModal } from "@/components/search-modal";

export function TopBar() {
  const { authenticated, login, logout } = useKeycloak();
  const [searchOpen, setSearchOpen] = useState(false);
  const axios = useAuthAxios();
  const profileRef = useRef<import("@/types").ProfileWithStats | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (authenticated && !profileLoaded) {
      getMyProfileWithStats(axios)
        .then((data) => {
          profileRef.current = data;
          setProfileLoaded(true);
        })
        .catch(() => setProfileLoaded(true));
    }
  }, [authenticated, profileLoaded, axios]);

  // Helper para obtener avatar
  const avatarUrl =
    authenticated && profileRef.current && profileRef.current.profile && profileRef.current.profile.avatarUrl
      ? profileRef.current.profile.avatarUrl
      : undefined;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-dark-card py-3 shadow-sm">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <LogoAndBrand />
          </div>
          {/* Desktop search bar opens modal */}
          <button
            type="button"
            className="relative hidden flex-1 max-w-md md:block focus:outline-none"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar películas, series, libros..."
              className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-dark-primary focus:ring-dark-primary text-dark-foreground placeholder:text-dark-muted-foreground"
              readOnly
              tabIndex={-1}
            />
          </button>
          <div className="flex items-center gap-4">
            {/* Mobile search icon opens modal */}
            <button
              type="button"
              className="md:hidden text-dark-foreground hover:text-dark-primary"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-6 w-6" />
            </button>
            {authenticated ? (
              <DesktopUserMenu onLogout={logout} {...(avatarUrl ? { avatarUrl } : {})} />
            ) : (
              <DesktopAuthButtons onLogin={login} />
            )}
          </div>
        </div>
      </header>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
