"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/20 via-movie-red/20 to-series-blue/20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-movie-red/10" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-10 right-10 w-40 h-40 bg-movie-red/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">¡Únete a la comunidad!</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            ¿Listo para descubrir tu próxima
            <span className="bg-gradient-to-r from-primary via-movie-red to-series-blue bg-clip-text text-transparent block">
              gran historia?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están disfrutando de la mejor experiencia para descubrir películas, libros
            y series increíbles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-movie-red hover:from-primary/90 hover:to-movie-red/90 text-lg px-8 py-6 group"
            >
              Comenzar Gratis Ahora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 text-lg px-8 py-6 bg-transparent"
            >
              Explorar Contenido
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Gratis para siempre • Sin tarjeta de crédito • Únete en 30 segundos
          </p>
        </div>
      </div>
    </section>
  )
}
