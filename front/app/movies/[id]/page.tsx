"use client";

import { useEffect, use, useState } from "react";
import { ContentDetail } from "@/components/content-detail";
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton";
import { useKeycloak } from "@/components/keycloak-provider";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { getItem } from "@/services/getItems";
import { MovieItem } from "@/types";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { id } = use(params) as { id: string };

  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();
  const [movie, setMovie] = useState<MovieItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const fetchedMovie = await getItem(id, axios);
        setMovie(fetchedMovie as MovieItem);
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

  if (loading || !movie) {
    return <MovieDetailSkeleton />;
  }
  return (
    <ContentDetail
      id={movie.id}
      title={movie.title}
      creators={movie.creators}
      genres={movie.genres}
      releaseDate={movie.releaseDate}
      rating={movie.rating}
      description={movie.description}
      images={movie.images}
      // userLists={[
      //   { id: "1", name: "Películas Favoritas" },
      //   { id: "2", name: "Películas para Ver" },
      //   { id: "3", name: "Clásicos del Cine" },
      // ]}
      contentType="movie"
      bgClass="bg-dark-movie-bg"
      accentColorClass="text-movie-red"
      focusColorClass="focus:border-movie-red"
      details={
        <>
          <div>
            <h3 className="font-semibold text-dark-primary">Director:</h3>
            <p>{movie.creators[0]}</p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-primary">Duración:</h3>
            <p>{movie.details.durationMinutes} min</p>
          </div>
        </>
      }
    />
  );
}
