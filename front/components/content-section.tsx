"use client";

import { useRef, useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ContentCard } from "@/components/content/content-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { Skeleton } from "@/components/ui/skeleton";
import { useKeycloak } from "./keycloak-provider";
import { getTrendingItems } from "@/services/getTrendingItems";

import { ContentType, MovieItem, BookItem, SeriesItem } from "@/types";

type ItemType = MovieItem | BookItem | SeriesItem;

interface ContentSectionProps {
  type: ContentType;
  title: string;
  colorClass: string; // e.g. "text-movie-red", "text-book-green", "text-series-blue"
  bgClass: string; // e.g. "bg-dark-movie-bg"
  itemFields: Array<{
    label: string;
    id: string;
    type?: string;
    options?: string[];
  }>;
  genres: string[];
  ratings: string[];
  getImageUrl: (item: ItemType) => string;
}

export function ContentSection(props: ContentSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();

  // Ref para el scroll infinito
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["content", props.type, searchTerm, filterGenre, filterRating],
    enabled: initialized && authenticated,
    queryFn: async ({ pageParam = 1 }) => {
      // Puedes añadir filtros aquí si tu API los soporta
      const response = await getTrendingItems({ type: props.type, page: pageParam, size: 40 }, axios);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Si la última página tiene menos items que el pageSize, no hay más
      if (!lastPage.items || lastPage.items.length === 0) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });

  // Unir todos los items de las páginas
  const items: ItemType[] = data?.pages.flatMap((page) => page.items) ?? [];

  // Scroll infinito: observar el loaderRef
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0,
        rootMargin: "0px 0px -300px 0px",
       }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className={cn("w-full min-h-screen transition-colors duration-500", props.bgClass, "text-dark-foreground")}> 
      <div className="container mx-auto px-4 py-8">
      <h1 className={cn("text-4xl font-bold mb-8", props.colorClass)}>
        {props.title}
      </h1>
      <h2 className="text-2xl font-semibold mb-4">
        Más relevantes
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {status === "pending"
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
            ))
          : items.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
              />
            ))}
        {isFetchingNextPage &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={"next-" + i} className="w-full aspect-[2/3] rounded-lg" />
          ))}
      </div>
      <div ref={loaderRef} style={{ height: 40 }} />
      {isFetchingNextPage && <div className="text-center py-4">Cargando más...</div>}
      {!hasNextPage && status === "success" && (
        <div className="text-center py-4 text-muted-foreground">No hay más resultados.</div>
      )}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">
              Añadir Nuevo {props.title}
            </DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Introduce los detalles del {props.title.toLowerCase()} que quieres
              añadir.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {props.itemFields.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label
                  htmlFor={field.id}
                  className="text-right text-dark-foreground"
                >
                  {field.label}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    className="col-span-3 bg-dark-input border-dark-border text-dark-foreground"
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type || "text"}
                    defaultValue=""
                    className="col-span-3 bg-dark-input border-dark-border text-dark-foreground"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn(
                props.colorClass.replace("text-", "bg-"),
                "text-dark-primary-foreground hover:opacity-90"
              )}
            >
              Guardar {props.title}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
