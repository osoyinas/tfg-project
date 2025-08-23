"use client"

import { TrendingUp, Users, Star, BookOpen } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "100K+",
    label: "Usuarios Activos",
    description: "Una comunidad creciente de amantes del entretenimiento",
  },
  {
    icon: Star,
    value: "1M+",
    label: "Reseñas Publicadas",
    description: "Millones de opiniones honestas y detalladas",
  },
  {
    icon: BookOpen,
    value: "50K+",
    label: "Títulos Catalogados",
    description: "Películas, libros y series de todo el mundo",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Satisfacción",
    description: "De nuestros usuarios recomiendan la plataforma",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-movie-red/10 to-series-blue/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Números que Hablan</h2>
          <p className="text-muted-foreground text-lg">La confianza de miles de usuarios nos respalda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex p-4 rounded-full bg-background/50 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-movie-red bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
