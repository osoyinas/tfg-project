// src/types/MediaItem.ts

export type MediaType = "MOVIE" | "BOOK" | "SERIES";

export interface ImageInfo {
  url: string;
  altText: string;
}

export interface MediaImages {
  poster: ImageInfo | null;
  cover: ImageInfo | null;
  thumbnail?: ImageInfo | null;
}

export interface ExternalSource {
  sourceName: string;
  externalId: string;
}

export interface MediaItemBase {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  rating: number;
  ratingCount: number;
  releaseDate: string;
  genres: string[];
  creators: string[] | null;
  images: MediaImages;
  externalSource: ExternalSource;
  relevantUntil: string | null;
  details: any;
  relevant: boolean;
}

// Movie details
export interface MovieDetails {
  durationMinutes?: number;
  originalLanguage?: string;
}

// Book details
export interface BookDetails {
  isbn?: string;
  publisher?: string;
  pageCount?: number;
}

// Movie item
export interface MovieItem extends MediaItemBase {
  type: "MOVIE";
  details: MovieDetails | null;
}

// Book item
export interface BookItem extends MediaItemBase {
  type: "BOOK";
  details: BookDetails | null;
}

// Union type for all media items
export type MediaItem = MovieItem | BookItem | MediaItemBase;
