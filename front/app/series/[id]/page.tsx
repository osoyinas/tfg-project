"use client";

import { useEffect, useRef, use, useState } from "react";
import { SeriesDetail } from "@/components/series-detail";
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
  const series = useRef<SeriesItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        const fetchedSeries = await getItem(id, axios);
        series.current = fetchedSeries as SeriesItem;
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

  if (loading || !series.current) {
    return <SeriesDetailSkeleton />;
  }
  return <SeriesDetail series={series.current} />;
}
