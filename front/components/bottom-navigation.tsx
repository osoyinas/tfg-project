"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Book, Tv, List, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchModal } from "./search-modal";

export function BottomNavigation() {
  const pathname = usePathname();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const navItems = [
    { href: "/movies", icon: Film, label: "Películas" },
    { href: "/books", icon: Book, label: "Libros" },
    { href: "/series", icon: Tv, label: "Series" },
    { href: "/lists", icon: List, label: "Listas" },
  ];

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 bg-dark-card border-t border-dark-border shadow-lg">
        <nav className="flex h-16 items-center justify-around px-2 max-w-2xl m-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="icon"
                asChild
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-dark-muted-foreground hover:bg-dark-accent hover:text-dark-primary",
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
        </nav>
      </div>
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </>
  );
}
