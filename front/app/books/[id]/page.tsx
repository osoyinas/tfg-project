"use client";

import { ContentDetail } from "@/components/content-detail";
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
  return (
    <ContentDetail
      title={book.title}
      creators={book.creators}
      genres={book.genres}
      releaseDate={book.releaseDate}
      rating={book.rating}
      description={book.description}
      images={book.images}
      // userLists={[
      //   { id: "1", name: "Libros Favoritos" },
      //   { id: "2", name: "Libros para Leer" },
      //   { id: "3", name: "Novelas Clásicas" },
      // ]}
      contentType="book"
      bgClass="bg-dark-book-bg"
      accentColorClass="text-book-green"
      focusColorClass="focus:border-book-green"
      details={
        <>
          <div>
            <h3 className="font-semibold text-dark-primary">Páginas:</h3>
            <p>{book.details.pageCount}</p>
          </div>
          <div>
            <h3 className="font-semibold text-dark-primary">Publisher:</h3>
            <p>{book.details.publisher}</p>
          </div>
        </>
      }
    />
  );
}
