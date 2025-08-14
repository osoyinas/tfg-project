"use client"

import { useState, useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useDebounce } from "use-debounce"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ai-elements/loader"
import { ContentCard } from "@/components/content/content-card"
import { Badge } from "@/components/ui/badge"
import { getItems } from "@/services/getItems"
import { useAuthAxios } from "@/hooks/useAuthAxios"
import { useKeycloak } from "./keycloak-provider"
import Loading from "@/app/loading"

const RECENT_SEARCHES_KEY = "recentSearches";

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const pathname = usePathname();

  // Cierra el modal si cambia la ruta
  useEffect(() => {
    if (!open) return;
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Infinite query replaces results state
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [type, setType] = useState<string>("Todos")

  const axios = useAuthAxios();
  const { initialized, authenticated } = useKeycloak();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) setRecentSearches(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches))
    }
  }, [recentSearches])

  // Debounce el valor del input
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Infinite query for search results
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedSearchTerm, type],
    enabled: initialized && authenticated && debouncedSearchTerm.length >= 3,
    queryFn: async ({ pageParam = 0 }) => {
      const params: any = { title: debouncedSearchTerm, page: pageParam };
      if (type !== "Todos") {
        params.type = type.toLowerCase();
      }
      const results = await getItems(params, axios);
      return { ...results, page: results.page };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.items || lastPage.items.length === 0) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });

  // Unify all items
  // Flatten results and keep track of page index for unique keys
  const results = data?.pages
    ? data.pages.flatMap((page, pageIndex) =>
        (page.items || []).map((item, itemIndex) => ({ ...item, _pageIndex: pageIndex, _itemIndex: itemIndex }))
      )
    : [];


  // Update loading state for UI
  useEffect(() => {
    setIsLoading(isFetching && debouncedSearchTerm.length >= 3);
  }, [isFetching, debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    }
  }

  // Animación de aparición/desaparición del contenido
  // Usamos un estado local para controlar el renderizado y la animación
  const [showContent, setShowContent] = useState(open);

  useEffect(() => {
    if (open) {
      setShowContent(true);
    } else {
      // Espera a que termine la animación antes de desmontar
      const timeout = setTimeout(() => setShowContent(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showContent && (
        <DialogContent
          className={`sm:max-w-[600px] p-0 bg-dark-card border-dark-border text-dark-foreground transition-all duration-200 ease-in-out
            ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            mt-8 sm:mt-0 max-h-[90dvh] sm:max-h-[80vh]'
          `}
          style={{
            top: 'env(safe-area-inset-top, 0px)',
          }}
        >
          <DialogHeader className="p-4 border-b border-dark-border">
            <DialogTitle className="text-dark-primary">Buscar</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="flex gap-2 items-center">
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
                className="rounded-lg bg-dark-input border-dark-border text-dark-foreground text-sm px-2 py-2 focus:border-dark-primary focus:ring-dark-primary"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="book">Libros</option>
                <option value="movie">Peliculas</option>
                <option value="tv_serie">Series</option>
              </select>
            </div>

 

            {results.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-dark-primary">Resultados de la búsqueda</h3>
                <div
                  ref={scrollContainerRef}
                  style={{
                    maxHeight: '350px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                    scrollbarWidth: 'thin',
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {results.map((content) => (
                      <ContentCard key={content.id} content={content} />
                    ))}
                    {/* Botón para cargar más resultados manualmente */}
                    {(() => {
                      const PAGE_SIZE = 20;
                      const lastPage = data?.pages?.[data.pages.length - 1];
                      const lastPageCount = lastPage?.items?.length ?? 0;
                      const noMoreResults = lastPage && (lastPageCount < PAGE_SIZE || lastPageCount === 0);
                      if (!hasNextPage || noMoreResults) return null;
                      return (
                        <div className="col-span-full flex flex-col items-center py-4 gap-2">
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              if (!isFetchingNextPage) fetchNextPage();
                            }}
                            disabled={isFetchingNextPage}
                          >
                            {isFetchingNextPage ? 'Cargando...' : 'Cargar más resultados'}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

           {isLoading && results.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <Loader />
              </div>
            )}
            {/* Mensaje si menos de 3 letras */}
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <div className="mt-6 text-center text-dark-muted-foreground">
                Escribe al menos 3 letras para buscar.
              </div>
            )}

            {!isLoading && results.length === 0 && searchTerm.length >= 3 && (
              <div className="mt-6 text-center text-dark-muted-foreground">
                No se encontraron resultados para "{searchTerm}".
              </div>
            )}

            {!isLoading && results.length === 0 && searchTerm.length === 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-dark-primary">Búsquedas Recientes</h3>
                  {recentSearches.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-dark-muted-foreground hover:text-dark-primary"
                      onClick={handleClearRecent}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
                {recentSearches.length === 0 ? (
                  <div className="text-dark-muted-foreground text-sm">No hay búsquedas recientes.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer bg-dark-accent text-dark-foreground hover:bg-dark-accent/80"
                        onClick={() => setSearchTerm(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}