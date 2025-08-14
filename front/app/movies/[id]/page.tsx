"use client";

import { useEffect, useRef, use, useState } from "react";
import { MovieDetail } from "@/components/movie-detail";
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton";
import { useKeycloak } from "@/components/keycloak-provider";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { getItem } from "@/services/getItems";
import { MovieItem } from "@/types";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  // Unwrap params using React.use() for Next.js 14+
  const { id } = use(params) as { id: string };

  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();
  const movie = useRef<MovieItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const fetchedMovie = await getItem(id, axios);
        movie.current = fetchedMovie as MovieItem;
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (initialized && authenticated) {
      fetchMovieData();
    }
  }, [initialized, authenticated, id]);

  if (loading || !movie.current) {
    return <MovieDetailSkeleton />;
  }
  return <MovieDetail movie={movie.current} />;
}
