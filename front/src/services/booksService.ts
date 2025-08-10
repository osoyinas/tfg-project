// src/services/booksService.ts
import { MediaItem } from "@/types/MediaItem";
import { axiosClient } from "@/lib/axiosClient";
import { axiosServer } from "@/lib/axiosServer";

// Llamada desde el cliente (browser)
export async function fetchTrendingBooksClient({
    pageParam = 0
}): Promise<MediaItem[]> {
  const res = await axiosClient.get("/api/catalog/items/trending", {
    params: { type: "book", page: pageParam },
  });
  return res.data.items;
}

// Llamada desde el servidor (SSR)
export async function fetchTrendingBooksServer(token?: string): Promise<MediaItem[]> {
  // Puedes pasar el token si lo tienes en SSR, si no, el interceptor lo ignora
  const res = await axiosServer.get("/api/catalog/items/trending", {
    params: { type: "book", page: 0 },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data.items;
}
