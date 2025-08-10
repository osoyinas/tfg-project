import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTrendingBooksClient } from "@/services/booksService";
import { MediaItem } from "@/types/MediaItem";
import { useRef, useCallback } from "react";
import { BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@components/ui/card";
import { ScrollArea } from "@components/ui/scroll-area";

const PAGE_SIZE = 20;

async function fetchBooks({ pageParam = 0 }) {
  // Aquí puedes modificar para paginación real si la API lo soporta
  const res = await fetchTrendingBooksClient({ pageParam });
  return res;
}

interface BooksSectionProps {
  className?: string;
  onItemSelect?: (type: string, id: string) => void;
}

export function BooksSection({ className, onItemSelect }: BooksSectionProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["books", "trending"],
    queryFn: fetchBooks,
    getNextPageParam: (lastPage, allPages) => {
      // Si la API soporta paginación, devolver el siguiente pageParam
      // Por ahora, solo un page
      return undefined;
    },
    initialPageParam: 0,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const books: MediaItem[] = data?.pages.flat() || [];

  return (
    <div
      className={`px-3 sm:px-4 py-4 space-y-6 max-w-7xl mx-auto ${
        className || ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-600">
            Libros
          </h1>
          <p className="text-gray-600 text-sm">Descubre y califica libros</p>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          <span className="text-xs sm:text-sm font-medium text-green-600 hidden sm:block">
            Bestsellers
          </span>
        </div>
      </div>

      {/* Trending Books */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-green-600">
          📚 Más Leídos
        </h2>
        <ScrollArea className="w-full">
          <div className="flex gap-3 sm:gap-4 pb-2">
            {books.map((book, idx) => (
              <Card
                key={book.id}
                className="min-w-[120px] sm:min-w-[140px] border-green-100 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
                onClick={() => onItemSelect?.("book", book.id)}
                ref={idx === books.length - 1 ? lastBookRef : undefined}
              >
                <CardContent className="p-2 sm:p-3">
                  <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <img
                      src={book.images?.poster?.url || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500">{book.creators?.[0]}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{book.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {isFetchingNextPage && (
              <div className="text-center w-full py-4">Cargando más...</div>
            )}
          </div>
        </ScrollArea>
      </div>
      {status === "error" && (
        <div className="text-red-500">Error: {error?.message}</div>
      )}
    </div>
  );
}
