"use client";

import { ContentSection } from "@/components/content-section";

export default function MoviesPage() {
  return (
    <ContentSection
      type="movie"
      title="Películas"
      colorClass="text-movie-red"
      bgClass="bg-dark-movie-bg"
      genres={[
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Thriller",
      ]}
      ratings={["4.5", "4.0", "3.5"]}
      itemFields={[
        { label: "Título", id: "title" },
        { label: "Género", id: "genre" },
        { label: "Calificación", id: "rating", type: "number" },
        { label: "Descripción", id: "description", type: "textarea" },
      ]}
      getImageUrl={(item) => item.images?.cover?.url || "/placeholder.svg"}
    />
  );
}
