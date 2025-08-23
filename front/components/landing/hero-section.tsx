"use client"

import { Button } from "@/components/ui/button"
import { Play, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useKeycloak } from "../keycloak-provider";

export function HeroSection() {
  const {login} = useKeycloak();
  return (
    <section className="pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-movie-red/10" />

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            🎉 Más de 100,000 usuarios activos
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Descubre tu próxima
            <span className="bg-gradient-to-r from-primary via-movie-red to-series-blue bg-clip-text text-transparent block">
              aventura favorita
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Califica, reseña y descubre películas, libros y series increíbles. Conecta con una comunidad apasionada por
            el entretenimiento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-movie-red hover:from-primary/90 hover:to-movie-red/90 text-lg px-8 py-6"
              onClick={login}
            >
              <Play className="mr-2 h-5 w-5" />
              Comenzar
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">4.9</span>
              </div>
              <p className="text-muted-foreground">Calificación promedio</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold">100K+</span>
              </div>
              <p className="text-muted-foreground">Usuarios activos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Play className="h-6 w-6 text-movie-red mr-2" />
                <span className="text-2xl font-bold">1M+</span>
              </div>
              <p className="text-muted-foreground">Reseñas publicadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute top-40 right-10 w-32 h-32 bg-movie-red/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-series-blue/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      />
    </section>
  )
}
