"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SearchFiltersSummary } from "@/components/search-filters-summary";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ai-elements/loader";
import { ContentCard } from "@/components/content/content-card";
// import { Badge } from "@/components/ui/badge";
import { getItems } from "@/services/getItems";
import type { Filters, Sort } from "@/types";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { useKeycloak } from "@/components/keycloak-provider";
import Loading from "@/app/loading";



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
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
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
    if (minDate) params.set("minDate", minDate); else params.delete("minDate");
    if (maxDate) params.set("maxDate", maxDate); else params.delete("maxDate");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (window.location.search !== `?${params.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchTerm, type, orderField, orderDir, minScore, maxScore, minDate, maxDate, router]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  //   }
  // }, [recentSearches]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const PAGE_SIZE = 20;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedSearchTerm, type, orderField, orderDir, minScore, maxScore, minDate, maxDate],
    enabled: initialized && authenticated && debouncedSearchTerm.length >= 3,
    queryFn: async ({ pageParam = 0 }) => {
      // Mapear los filtros locales al tipo Filters global
      const filters: Filters = {
        title: debouncedSearchTerm,
        type: type === "Todos" ? undefined : (type.toUpperCase() as Filters["type"]),
        min_rating: minScore > 0 ? minScore : undefined,
        max_rating: maxScore < 5 ? maxScore : undefined,
        min_year: minDate ? Number(minDate.split("-")[0]) : undefined,
        max_year: maxDate ? Number(maxDate.split("-")[0]) : undefined,
        // géneros: aquí puedes mapear si tienes estado de géneros
        sort_by:
          orderField === "relevance"
            ? undefined
            : orderField === "date"
            ? (orderDir === "asc" ? "RELEASE_DATE_ASC" : "RELEASE_DATE_DESC")
            : orderField === "score"
            ? (orderDir === "asc" ? "RATING_ASC" : "RATING_DESC")
            : undefined,
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
                  <div>
                    <Label>Ordenar por</Label>
                    <div className="flex gap-2">
                      <Select value={orderField} onValueChange={v => setOrderField(v as "relevance" | "date" | "score")}> 
                        <SelectTrigger className="w-full bg-dark-input border-dark-border text-dark-foreground mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                          <SelectItem value="relevance">Relevancia</SelectItem>
                          <SelectItem value="date">Fecha</SelectItem>
                          <SelectItem value="score">Puntuación</SelectItem>
                        </SelectContent>
                      </Select>
                      {orderField !== "relevance" && (
                        <Select value={orderDir} onValueChange={v => setOrderDir(v as "asc" | "desc")}> 
                          <SelectTrigger className="w-24 bg-dark-input border-dark-border text-dark-foreground mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                            <SelectItem value="desc">↓</SelectItem>
                            <SelectItem value="asc">↑</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
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
                      <Label>Fecha mínima</Label>
                      <Input type="date" value={minDate} onChange={e => setMinDate(e.target.value)} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                    <div className="flex-1">
                      <Label>Fecha máxima</Label>
                      <Input type="date" value={maxDate} onChange={e => setMaxDate(e.target.value)} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="outline" onClick={() => {
                    setOrderField("relevance"); setOrderDir("desc"); setMinScore(0); setMaxScore(5); setMinDate(""); setMaxDate("");
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
                  <div>
                    <Label>Ordenar por</Label>
                    <div className="flex gap-2">
                      <Select value={orderField} onValueChange={v => setOrderField(v as "relevance" | "date" | "score")}> 
                        <SelectTrigger className="w-full bg-dark-input border-dark-border text-dark-foreground mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                          <SelectItem value="relevance">Relevancia</SelectItem>
                          <SelectItem value="date">Fecha</SelectItem>
                          <SelectItem value="score">Puntuación</SelectItem>
                        </SelectContent>
                      </Select>
                      {orderField !== "relevance" && (
                        <Select value={orderDir} onValueChange={v => setOrderDir(v as "asc" | "desc")}> 
                          <SelectTrigger className="w-24 bg-dark-input border-dark-border text-dark-foreground mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                            <SelectItem value="desc">↓</SelectItem>
                            <SelectItem value="asc">↑</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
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
                      <Label>Fecha mínima</Label>
                      <Input type="date" value={minDate} onChange={e => setMinDate(e.target.value)} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                    <div className="flex-1">
                      <Label>Fecha máxima</Label>
                      <Input type="date" value={maxDate} onChange={e => setMaxDate(e.target.value)} className="bg-dark-input border-dark-border text-dark-foreground mt-1" />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => {
                    setOrderField("relevance"); setOrderDir("desc"); setMinScore(0); setMaxScore(10); setMinDate(""); setMaxDate("");
                  }}>Limpiar filtros</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filtros activos resumen */}
        <SearchFiltersSummary
          orderBy={orderField !== "relevance" ? `${orderField}_${orderDir}` : ""}
          minScore={minScore}
          maxScore={maxScore}
          minDate={minDate}
          maxDate={maxDate}
          onClear={(key) => {
            if (key === "orderBy") { setOrderField("relevance"); setOrderDir("desc"); }
            if (key === "minScore") setMinScore(0);
            if (key === "maxScore") setMaxScore(5);
            if (key === "minDate") setMinDate("");
            if (key === "maxDate") setMaxDate("");
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
        {isFetching && <div className="text-center py-4">Cargando más...</div>}
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
