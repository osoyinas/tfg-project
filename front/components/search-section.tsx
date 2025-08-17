"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SearchFiltersSummary } from "@/components/search-filters-summary";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/content-card";
// import { Badge } from "@/components/ui/badge";
import { getItems } from "@/services/getItems";
import type { Filters } from "@/types";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { useKeycloak } from "@/components/keycloak-provider";



export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const initialTerm = searchParams.get("term") || "";
  const initialType = searchParams.get("type") || "Todos";
  const initialOrderBy = searchParams.get("orderBy") || "";

  function parseOrderBy(orderBy: string): { field: "relevance" | "date" | "score"; dir: "asc" | "desc" } {
    if (orderBy.startsWith("RELEASE_DATE")) {
      return { field: "date", dir: orderBy.endsWith("ASC") ? "asc" : "desc" };
    }
    if (orderBy.startsWith("RATING")) {
      return { field: "score", dir: orderBy.endsWith("ASC") ? "asc" : "desc" };
    }
    return { field: "relevance", dir: "desc" };
  }

  const { field: initialOrderField, dir: initialOrderDir } = parseOrderBy(initialOrderBy);

  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [type, setType] = useState(initialType);
  const [orderField, setOrderField] = useState<"relevance" | "date" | "score">(initialOrderField);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">(initialOrderDir);
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(5);
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minYearError, setMinYearError] = useState<string | null>(null);
  const [maxYearError, setMaxYearError] = useState<string | null>(null);
  // Si agregas géneros, aquí puedes añadir un estado para ellos

  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();


  // Sincronizar searchTerm y type con la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set("term", searchTerm);
    } else {
      params.delete("term");
    }
    if (type && type !== "Todos") {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    if (orderField !== "relevance") {
      params.set("orderBy", `${orderField}_${orderDir}`);
    } else {
      params.delete("orderBy");
    }
    if (minScore > 0) params.set("minScore", String(minScore)); else params.delete("minScore");
    if (maxScore < 5) params.set("maxScore", String(maxScore)); else params.delete("maxScore");
    if (minYear) params.set("minYear", minYear); else params.delete("minYear");
    if (maxYear) params.set("maxYear", maxYear); else params.delete("maxYear");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (window.location.search !== `?${params.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchTerm, type, orderField, orderDir, minScore, maxScore, minYear, maxYear, router]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const PAGE_SIZE = 20;
  const isValidSearch =
    initialized &&
    authenticated &&
    debouncedSearchTerm.length >= 3 &&
    (!minYearError && !maxYearError) &&
    (
      (minYear === "" || maxYear === "") ||
      (minYear !== "" && maxYear !== "" && Number(minYear) < Number(maxYear))
    );

  useEffect(() => {
    let minErr: string | null = null;
    let maxErr: string | null = null;
    const min = minYear ? Number(minYear) : null;
    const max = maxYear ? Number(maxYear) : null;
    if (minYear && (isNaN(Number(minYear)) || Number(minYear) < 1800)) {
      minErr = "El año mínimo debe ser 1800 o mayor";
    } else if (min && min > 2100) {
      minErr = "El año mínimo no puede ser mayor que 2100";
    }
    if (maxYear && (isNaN(Number(maxYear)) || Number(maxYear) > 2100)) {
      maxErr = "El año máximo debe ser 2100 o menor";
    } else if (max && max < 1800) {
      maxErr = "El año máximo debe ser 1800 o mayor";
    }
    if (
      min !== null &&
      max !== null &&
      !minErr &&
      !maxErr &&
      min >= max
    ) {
      minErr = "El año mínimo debe ser menor que el máximo";
      maxErr = "El año máximo debe ser mayor que el mínimo";
    }
    setMinYearError(minErr);
    setMaxYearError(maxErr);
  }, [minYear, maxYear]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedSearchTerm, type, orderField, orderDir, minScore, maxScore, minYear, maxYear],
    enabled: isValidSearch,
    queryFn: async ({ pageParam = 0 }) => {
      // Mapear los filtros locales al tipo Filters global
      const filters: Filters = {
        title: debouncedSearchTerm,
        type: type === "Todos" ? undefined : (type.toUpperCase() as Filters["type"]),
        min_rating: minScore > 0 ? minScore : undefined,
        max_rating: maxScore < 5 ? maxScore : undefined,
        min_year: minYear ? Number(minYear) : undefined,
        max_year: maxYear ? Number(maxYear) : undefined,
        page: pageParam,
        size: PAGE_SIZE,
      };
      const results = await getItems(filters, axios);
      return { ...results, page: results.page };
    },
    getNextPageParam: (lastPage, allPages) => {
      const lastCount = lastPage?.items?.length ?? 0;
      if (lastCount === 0 || lastCount < PAGE_SIZE) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });

  const results = data?.pages
    ? data.pages.flatMap((page, pageIndex) =>
        (page.items || []).map((item, itemIndex) => ({
          ...item,
          _pageIndex: pageIndex,
          _itemIndex: itemIndex,
        }))
      )
    : [];

  useEffect(() => {
    setIsLoading(isFetching && debouncedSearchTerm.length >= 3);
  }, [isFetching, debouncedSearchTerm]);

  // Scroll infinito con IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full min-h-screen transition-colors duration-500 bg-dark-movie-bg text-dark-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-dark-primary">Buscar</h1>
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar películas, libros, series..."
              className="w-full rounded-lg bg-dark-input pl-9 pr-4 py-2 text-sm border-dark-border focus:border-dark-primary focus:ring-dark-primary text-dark-foreground placeholder:text-dark-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg bg-dark-input border-dark-border text-dark-foreground text-sm px-2 py-3 focus:border-dark-primary focus:ring-dark-primary"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="book">Libros</option>
            <option value="movie">Peliculas</option>
            <option value="tv_serie">Series</option>
          </select>
          {/* Filtros: Drawer en móvil, Popover en desktop */}
          <div className="block md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="ml-1 py-4">Filtros</Button>
              </DrawerTrigger>
              <DrawerContent className="bg-dark-card border-dark-border text-dark-foreground">
                <DrawerHeader>
                  <DrawerTitle>Filtros avanzados</DrawerTitle>
                </DrawerHeader>
                <div className="grid gap-4 p-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Puntuación mínima</Label>
                      <Input type="number" min={0} max={5} value={minScore} onChange={e => setMinScore(Number(e.target.value))} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                    <div className="flex-1">
                      <Label>Puntuación máxima</Label>
                      <Input type="number" min={0} max={5} value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Año mínimo</Label>
                      <Input
                        type="number"
                        min={1800}
                        max={2100}
                        value={minYear}
                        onChange={e => setMinYear(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (!minYearError && !maxYearError && minYear !== "" && maxYear !== "" && Number(minYear) < Number(maxYear)) refetch();
                          }
                        }}
                        className={
                          "bg-dark-input border-dark-border text-dark-foreground mt-1" +
                          (minYearError ? " border-red-500 focus:border-red-500" : "")
                        }
                        placeholder="Ej: 2000"
                      />
                      {minYearError && (
                        <span className="text-xs text-red-500">{minYearError}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label>Año máximo</Label>
                      <Input
                        type="number"
                        min={1800}
                        max={2100}
                        value={maxYear}
                        onChange={e => setMaxYear(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (!minYearError && !maxYearError && minYear !== "" && maxYear !== "" && Number(minYear) < Number(maxYear)) refetch();
                          }
                        }}
                        className={
                          "bg-dark-input border-dark-border text-dark-foreground mt-1" +
                          (maxYearError ? " border-red-500 focus:border-red-500" : "")
                        }
                        placeholder="Ej: 2024"
                      />
                      {maxYearError && (
                        <span className="text-xs text-red-500">{maxYearError}</span>
                      )}
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="outline" onClick={() => {
                    setOrderField("relevance"); setOrderDir("desc"); setMinScore(0); setMaxScore(5); setMinYear(""); setMaxYear("");
                  }}>Limpiar filtros</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-2 py-2">Filtros</Button>
              </PopoverTrigger>
              <PopoverContent className="bg-dark-card border-dark-border text-dark-foreground w-96">
                <div className="grid gap-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Puntuación mínima</Label>
                      <Input type="number" min={0} max={5} value={minScore} onChange={e => setMinScore(Number(e.target.value))} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                    <div className="flex-1">
                      <Label>Puntuación máxima</Label>
                      <Input type="number" min={0} max={5} value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Año mínimo</Label>
                      <Input
                        type="number"
                        min={1800}
                        max={2100}
                        value={minYear}
                        onChange={e => setMinYear(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (!minYearError && !maxYearError && minYear !== "" && maxYear !== "" && Number(minYear) < Number(maxYear)) refetch();
                          }
                        }}
                        className={
                          "bg-dark-input border-dark-border text-dark-foreground mt-1" +
                          (minYearError ? " border-red-500 focus:border-red-500" : "")
                        }
                        placeholder="Ej: 2000"
                      />
                      {minYearError && (
                        <span className="text-xs text-red-500">{minYearError}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label>Año máximo</Label>
                      <Input
                        type="number"
                        min={1800}
                        max={2100}
                        value={maxYear}
                        onChange={e => setMaxYear(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (!minYearError && !maxYearError && minYear !== "" && maxYear !== "" && Number(minYear) < Number(maxYear)) refetch();
                          }
                        }}
                        className={
                          "bg-dark-input border-dark-border text-dark-foreground mt-1" +
                          (maxYearError ? " border-red-500 focus:border-red-500" : "")
                        }
                        placeholder="Ej: 2024"
                      />
                      {maxYearError && (
                        <span className="text-xs text-red-500">{maxYearError}</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => {
                    setOrderField("relevance"); setOrderDir("desc"); setMinScore(0); setMaxScore(10); setMinYear(""); setMaxYear("");
                  }}>Limpiar filtros</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filtros activos resumen */}
        <SearchFiltersSummary
          minScore={minScore}
          maxScore={maxScore}
          minYear={minYear}
          maxYear={maxYear}
          onClear={(key) => {
            if (key === "minScore") setMinScore(0);
            if (key === "maxScore") setMaxScore(5);
            if (key === "minYear") setMinYear("");
            if (key === "maxYear") setMaxYear("");
          }}
        />



        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {isLoading && results.length === 0
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-full aspect-[2/3] rounded-lg bg-dark-input animate-pulse" />
              ))
            : results.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
          {/* Skeletons para fetchNextPage (scroll infinito) */}
          {isFetching && results.length > 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={"next-" + i} className="w-full aspect-[2/3] rounded-lg bg-dark-input animate-pulse" />
            ))}
        </div>
  <div ref={loaderRef} style={{ height: 40 }} />
        {!isFetching && !isLoading && results.length === 0 && searchTerm.length >= 3 && (
          <div className="mt-6 text-center text-dark-muted-foreground">
            No se encontraron resultados para "{searchTerm}".
          </div>
        )}

        {/* Mensaje si menos de 3 letras */}
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <div className="mt-6 text-center text-dark-muted-foreground">
            Escribe al menos 3 letras para buscar.
          </div>
        )}
      </div>
    </div>
  );
}
