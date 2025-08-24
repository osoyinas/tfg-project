"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Book, Tv, List, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/movies", icon: Film, label: "Películas" },
    { href: "/books", icon: Book, label: "Libros" },
    { href: "/series", icon: Tv, label: "Series" },
  ];

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 bg-dark-card border-t border-dark-border shadow-lg">
        <nav className="flex h-16 items-center justify-around px-2 max-w-2xl m-auto">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="icon"
                asChild
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary px-10",
                  isActive && "text-dark-primary"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </Button>
            );
          })}
          {/* Botón de búsqueda */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex h-full flex-col items-center justify-center gap-1 text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary px-10",
              pathname === "/search" && "text-dark-primary"
            )}
            onClick={() => router.push("/search")}
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Buscar</span>
          </Button>
        </nav>
      </div>
    </>
  );
}
