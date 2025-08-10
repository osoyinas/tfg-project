import { useState } from "react";
import {
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { SearchModal } from "@components/search-modal";
import { AuthButton } from "./auth/AuthButton";

interface TopBarProps {
  onSectionChange?: (section: string) => void;
}

export function TopBar({ onSectionChange }: TopBarProps) {
  // const session = auth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Changed to true for demo
  const [notifications] = useState(3); // Mock notifications

  const handleProfileClick = () => {
    if (onSectionChange) {
      onSectionChange("profile");
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:block">
              RateIt
            </span>
          </div>

          {/* Search Button */}
          <div className="flex-1 max-w-md mx-4">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-500 border-gray-200 hover:bg-gray-50"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                Buscar películas, libros, series...
              </span>
              <span className="sm:hidden">Buscar...</span>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-4 space-y-3">
              <AuthButton />
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
