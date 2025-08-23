"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Lectora Ávida",
    avatar: "/placeholder.svg?height=60&width=60&text=MG",
    rating: 5,
    text: "Esta plataforma cambió completamente cómo descubro nuevos libros. Las recomendaciones son increíblemente precisas y la comunidad es muy acogedora.",
  },
  {
    name: "Carlos Rodríguez",
    role: "Cinéfilo",
    avatar: "/placeholder.svg?height=60&width=60&text=CR",
    rating: 5,
    text: "Como amante del cine, encontré aquí mi lugar perfecto. Las reseñas son detalladas y me han ayudado a descubrir joyas cinematográficas que nunca habría encontrado solo.",
  },
  {
    name: "Ana Martínez",
    role: "Fan de Series",
    avatar: "/placeholder.svg?height=60&width=60&text=AM",
    rating: 5,
    text: "La función de listas personalizadas es genial. Puedo organizar mis series por género, estado de visualización y compartirlas con amigos. ¡Súper útil!",
  },
  {
    name: "Diego López",
    role: "Crítico Amateur",
    avatar: "/placeholder.svg?height=60&width=60&text=DL",
    rating: 5,
    text: "Me encanta poder escribir reseñas detalladas y recibir feedback de la comunidad. Es como tener un club de lectura y cine virtual disponible 24/7.",
  },
  {
    name: "Laura Fernández",
    role: "Estudiante",
    avatar: "/placeholder.svg?height=60&width=60&text=LF",
    rating: 5,
    text: "Perfecto para encontrar contenido educativo y entretenido. Las categorías están muy bien organizadas y siempre encuentro algo interesante para ver o leer.",
  },
  {
    name: "Roberto Silva",
    role: "Padre de Familia",
    avatar: "/placeholder.svg?height=60&width=60&text=RS",
    rating: 5,
    text: "Excelente para encontrar contenido familiar. Los filtros de edad y las reseñas de otros padres me ayudan a elegir qué ver con mis hijos.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que Dicen Nuestros Usuarios</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Miles de personas ya disfrutan de una mejor experiencia descubriendo entretenimiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-primary/30 mb-4" />

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
