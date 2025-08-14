// types/index.ts
export interface Pagination<T> {
  page: number;
  pageSize: number;
  items: T[];
}

export type ContentType = "MOVIE" | "BOOK" | "TV_SERIE";

export interface ImageInfo {
  url: string;
  altText: string;
}

export interface ContentImages {
  poster: ImageInfo | null;
  cover: ImageInfo | null;
  thumbnail: ImageInfo | null;
}

export interface ExternalSource {
  sourceName: string;
  externalId: string;
}

export interface BaseContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  rating: number;
  ratingCount: number;
  releaseDate: string; // YYYY-MM-DD
  genres: string[];
  creators: string[]; // Directors, Authors, Creators
  images: ContentImages;
  externalSource: ExternalSource;
  relevantUntil: string | null;
  relevant: boolean;
}

export interface BookDetails {
  isbn: string;
  publisher: string;
  pageCount: number;
}

export interface MovieDetails {
  durationMinutes: number;
  originalLanguage: string;
}

export interface SeriesDetails {
  seasonCount: number;
  episodeCount: number;
  averageRuntime: number;
  originalLanguage: string;
}

export interface BookItem extends BaseContentItem {
  type: "BOOK";
  details: BookDetails;
}

export interface MovieItem extends BaseContentItem {
  type: "MOVIE";
  details: MovieDetails;
}

export interface SeriesItem extends BaseContentItem {
  type: "TV_SERIE";
  details: SeriesDetails;
}

export interface ListItem extends BaseContentItem {
  type: "BOOK";
  details: List;
}

export type ContentItem = BookItem | MovieItem | SeriesItem | ListItem;

export interface Content {
  id: string;
  title: string;
  imageUrl: string;
  type: "movie" | "book" | "series";
  rating?: number;
  genre?: string;
  description?: string;
  releaseDate?: string; // For movies
  author?: string; // For books
  pages?: number; // For books
  publicationDate?: string; // For books
  creator?: string; // For series
  seasons?: number; // For series
  releaseYear?: string; // For series
  cast?: string[]; // For movies/series
  director?: string; // For movies
  reviews?: Review[];
}

export interface Review {
  id: string;
  user?: string;
  contentTitle: string;
  contentType: "movie" | "book" | "series";
  rating: number;
  text: string;
  date: string;
}

export interface List {
  id: string;
  name: string;
  description: string;
  items: number;
  type: "movie" | "book" | "series" | "mixed";
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export type ActivityType = "RATING" | "REVIEW" | "ADDED_TO_LIST";

export interface UserActivity {
  id: string;
  type: ActivityType;
  content: {
    id: string;
    title: string;
    type: ContentType;
    imageUrl: string;
  };
  rating?: number;
  review?: string;
  listName?: string;
  timestamp: string;
  user?: User; // Optional, for feed items
}

export interface ListAuthor {
  name: string;
  username: string;
  avatar: string;
}

export interface ListOverview {
  id: number;
  title: string;
  description: string;
  author: ListAuthor;
  image: string;
  itemCount: number;
  isPublic: boolean;
  likes: number;
  comments: number;
  collaborators: number;
  lastUpdated: string;
  sharedBy?: string;
}

export interface Friend {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isInvited: boolean;
  mutualFriends: number;
}
