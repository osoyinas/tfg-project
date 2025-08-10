"use client";

import { ContentSection } from "@/components/content-section";

export default function BooksPage() {
  return (
    <ContentSection
      type="book"
      title="Libros"
      colorClass="text-book-green"
      bgClass="bg-dark-book-bg"
      genres={[
        "Fantasy",
        "Sci-Fi",
        "Self-Help",
        "Mythology",
        "Historical Fiction",
        "Mystery",
        "Fiction",
        "Memoir",
      ]}
      ratings={["4.5", "4.0", "3.5"]}
      itemFields={[
        { label: "Título", id: "title" },
        { label: "Autor", id: "author" },
        { label: "Calificación", id: "rating", type: "number" },
        { label: "Descripción", id: "description", type: "textarea" },
      ]}
      getImageUrl={(item) => item.images?.cover?.url || "/placeholder.svg"}
    />
  );
}
