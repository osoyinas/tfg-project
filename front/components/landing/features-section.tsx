"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Users, TrendingUp, Heart, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Star,
    title: "Calificaciones Inteligentes",
    description: "Sistema de calificación avanzado que aprende de tus gustos y te sugiere contenido personalizado.",
    color: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description:
      "Conecta con otros fanáticos, comparte reseñas y descubre nuevas perspectivas sobre tu contenido favorito.",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Tendencias en Tiempo Real",
    description: "Mantente al día con lo más popular y trending en películas, libros y series.",
    color: "text-movie-red",
  },
  {
    icon: Heart,
    title: "Listas Personalizadas",
    description: "Crea y comparte listas temáticas. Desde 'Películas para llorar' hasta 'Libros que cambian vidas'.",
    color: "text-book-green",
  },
  {
    icon: Zap,
    title: "Recomendaciones IA",
    description: "Algoritmo inteligente que analiza tus gustos y te recomienda contenido que realmente te gustará.",
    color: "text-series-blue",
  },
  {
    icon: Shield,
    title: "Comunidad Segura",
    description: "Moderación activa y herramientas para mantener un ambiente respetuoso y constructivo.",
    color: "text-list-purple",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir ReviewIt?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Más que una plataforma de reseñas, somos tu compañero perfecto para descubrir entretenimiento increíble
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-6">
                <div
                  className={`inline-flex p-3 rounded-lg bg-background/50 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
