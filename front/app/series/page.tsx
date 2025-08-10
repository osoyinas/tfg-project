"use client";

import { ContentSection } from "@/components/content-section";

export default function SeriesPage() {
  return (
    <ContentSection
      type="tv_serie"
      title="Series"
      colorClass="text-series-blue"
      bgClass="bg-dark-series-bg"
      genres={["Drama", "Crime", "Sci-Fi", "Historical", "Comedy", "Thriller"]}
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
