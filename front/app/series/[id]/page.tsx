"use client";

import { useEffect, use, useState } from "react";
import { ContentDetail } from "@/components/content-detail";
import { SeriesDetailSkeleton } from "@/components/series-detail-skeleton";
import { useKeycloak } from "@/components/keycloak-provider";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { getItem } from "@/services/getItems";
import { SeriesItem } from "@/types";

interface SeriesDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function SeriesDetailsPage({ params }: SeriesDetailsPageProps) {
  // Unwrap params using React.use() for Next.js 14+
  const { id } = use(params) as { id: string };

  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();
  const [series, setSeries] = useState<SeriesItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        const fetchedSeries = await getItem(id, axios);
        setSeries(fetchedSeries as SeriesItem);
      } catch (error) {
        console.error("Error fetching series data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (initialized && authenticated) {
      fetchSeriesData();
    }
  }, [initialized, authenticated, id]);

  if (loading || !series) {
    return <SeriesDetailSkeleton />;
  }
  return (
    <ContentDetail
      id={series.id}
      title={series.title}
      creators={series.creators}
      genres={series.genres}
      releaseDate={series.releaseDate}
      rating={series.rating}
      description={series.description}
      images={series.images}
      // userLists={[
      //   { id: "1", name: "Series Favoritas" },
      //   { id: "2", name: "Series para Ver" },
      //   { id: "3", name: "Series de Drama" },
      // ]}
      contentType="series"
      bgClass="bg-dark-series-bg"
      accentColorClass="text-series-blue"
      focusColorClass="focus:border-series-blue"
      details={
        <>
          <div>
            <h3 className="font-semibold text-dark-primary">Creador:</h3>
            <p>{series.creators?.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-primary">Temporadas:</h3>
            <p>{series.details.seasonCount}</p>
          </div>
        </>
      }
    />
  );
}
