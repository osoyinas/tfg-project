"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Film, Menu, X } from "lucide-react";
import Link from "next/link";
import { useKeycloak } from "../keycloak-provider";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { login } = useKeycloak();
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-movie-red bg-clip-text text-transparent">
              ReviewIt
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              onClick={login}
            >
              Iniciar Sesión
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-movie-red hover:from-primary/90 hover:to-movie-red/90"
              onClick={login}
            >
              Registrarse Gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="ghost" className="justify-start">
                  Iniciar Sesión
                </Button>
                <Button className="bg-gradient-to-r from-primary to-movie-red">
                  Registrarse Gratis
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
