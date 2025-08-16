"use client";

import SearchPage from "@/components/search-section";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetailsPage() {
  return <SearchPage />;
}
