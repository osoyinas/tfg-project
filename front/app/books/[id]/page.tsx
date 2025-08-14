"use client";

import { BookDetail } from "@/components/book-detail";
import { BookDetailSkeleton } from "@/components/book-detail-skeleton";
import { useKeycloak } from "@/components/keycloak-provider";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { getItem } from "@/services/getItems";
import { BookItem } from "@/types";
import { useEffect, use, useState } from "react";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  // Unwrap params using React.use() for Next.js 14+
  const { id } = use(params) as { id: string };

  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();
  const [book, setBook] = useState<BookItem | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const fetchedBook = await getItem(id, axios);
        setBook(fetchedBook as BookItem);
      } catch (error) {}
    };

    if (initialized && authenticated) {
      fetchBookData();
    }
  }, [initialized, authenticated, id]);

  if (!book) {
    return <BookDetailSkeleton />;
  }
  return <BookDetail book={book} />;
}
