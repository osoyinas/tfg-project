import type { Content, List } from "@/types";

// Mock data for content items
const mockContent: Content[] = [
  {
    id: "m1",
    title: "Dune: Part Two",
    type: "movie",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.8,
    genre: "Sci-Fi",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya"],
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.",
    releaseDate: "2024-03-01",
    reviews: [],
  },
  {
    id: "b1",
    title: "Project Hail Mary",
    type: "book",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.7,
    genre: "Sci-Fi",
    author: "Andy Weir",
    pages: 496,
    description:
      "An astronaut wakes up on a spaceship with no memory of how he got there, tasked with saving humanity.",
    publicationDate: "2021-05-04",
    reviews: [],
  },
  {
    id: "s1",
    title: "Breaking Bad",
    type: "series",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.9,
    genre: "Crime",
    creator: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul"],
    description:
      "A high school chemistry teacher turns to manufacturing and selling methamphetamine after being diagnosed with lung cancer.",
    releaseYear: "2008",
    seasons: 5,
    reviews: [],
  },
  {
    id: "m2",
    title: "Oppenheimer",
    type: "movie",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.7,
    genre: "Biography",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt"],
    description:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    releaseDate: "2023-07-21",
    reviews: [],
  },
  {
    id: "b2",
    title: "The Midnight Library",
    type: "book",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.2,
    genre: "Fantasy",
    author: "Matt Haig",
    pages: 304,
    description:
      "Orphan chess prodigy Beth Harmon rises to the top of the chess world while struggling with addiction.",
    publicationDate: "2020-09-29",
    reviews: [],
  },
  {
    id: "s2",
    title: "The Queen's Gambit",
    type: "series",
    imageUrl: "/placeholder.svg?height=300&width=200",
    rating: 4.7,
    genre: "Drama",
    creator: "Scott Frank",
    cast: ["Anya Taylor-Joy"],
    description:
      "Orphan chess prodigy Beth Harmon rises to the top of the chess world while struggling with addiction.",
    releaseYear: "2020",
    seasons: 1,
    reviews: [],
  },
];

// Mock data for lists
const mockLists: List[] = [
  {
    id: "l1",
    name: "Películas Favoritas",
    description: "Mis películas imprescindibles de todos los tiempos.",
    items: 15,
    type: "movie",
    isPublic: true,
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2024-07-25T14:30:00Z",
  },
  {
    id: "l2",
    name: "Libros para el Verano",
    description: "Lecturas ligeras y emocionantes para la temporada.",
    items: 8,
    type: "book",
    isPublic: false,
    createdAt: "2023-05-01T11:00:00Z",
    updatedAt: "2024-07-20T09:15:00Z",
  },
  {
    id: "l3",
    name: "Series que Recomiendo",
    description: "Series que no te puedes perder.",
    items: 12,
    type: "series",
    isPublic: true,
    createdAt: "2023-03-15T09:00:00Z",
    updatedAt: "2024-07-22T16:00:00Z",
  },
  {
    id: "l4",
    name: "Documentales Impactantes",
    description: "Documentales que te harán pensar.",
    items: 7,
    type: "movie",
    isPublic: true,
    createdAt: "2023-08-20T13:00:00Z",
    updatedAt: "2024-07-18T10:00:00Z",
  },
  {
    id: "l5",
    name: "Novelas de Misterio",
    description: "Intrigas y suspense en cada página.",
    items: 10,
    type: "book",
    isPublic: false,
    createdAt: "2023-11-05T15:00:00Z",
    updatedAt: "2024-07-10T11:45:00Z",
  },
];

export async function fetchContent(
  type: Content["type"] | "all"
): Promise<Content[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (type === "all") {
    return mockContent;
  }
  return mockContent.filter((item) => item.type === type);
}

export async function fetchContentById(
  id: string,
  type: Content["type"]
): Promise<Content | undefined> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allContent = await fetchContent("all");
  const content = allContent.find(
    (item) => item.id === id && item.type === type
  );

  // Add mock reviews for detail pages
  if (content) {
    content.reviews = [
      // {
      //   id: "rev1",
      //   user: "Alice",
      //   rating: 4.5,
      //   text: "¡Me encantó! Una experiencia increíble.",
      //   date: "2024-07-25",
      //   contentTitle: content.title,
      //   contentType: content.type,
      // },
      // {
      //   id: "rev2",
      //   user: "Bob",
      //   rating: 4.0,
      //   text: "Muy buena, aunque un poco lenta al principio.",
      //   date: "2024-07-20",
      //   contentTitle: content.title,
      //   contentType: content.type,
      // },
    ];
  }
  return content;
}

export async function fetchLists(): Promise<List[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));

  return mockLists;
}

// export async function fetchListById(id: string): Promise<List | undefined> {
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   const allLists = await fetchLists()
//   const list = allLists.find((l) => l.id === id)

//   // Add mock items for detail page
//   if (list) {
//     list.items = [
//       {
//         id: "m1",
//         title: "Dune: Part Two",
//         type: "movie",
//         imageUrl: "/placeholder.svg?height=300&width=200",
//         rating: 4.8,
//       },
//       {
//         id: "b1",
//         title: "Project Hail Mary",
//         type: "book",
//         imageUrl: "/placeholder.svg?height=300&width=200",
//         rating: 4.7,
//       },
//       {
//         id: "s1",
//         title: "Breaking Bad",
//         type: "series",
//         imageUrl: "/placeholder.svg?height=300&width=200",
//         rating: 4.9,
//       },
//       { id: "m2", title: "Oppenheimer", type: "movie", imageUrl: "/placeholder.svg?height=300&width=200", rating: 4.7 },
//     ]
//   }
//   return list
// }

export async function fetchContentItems(
  type?: Content["type"],
  query?: string,
  genre?: string
): Promise<{ items: Content[]; totalCount: number }> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  let filteredItems = mockContent;

  if (type) {
    filteredItems = filteredItems.filter((item) => item.type === type);
  }

  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description?.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (genre) {
    filteredItems = filteredItems.filter((item) => item.genre === genre);
  }

  return { items: filteredItems, totalCount: filteredItems.length };
}

export async function getSearchResults(
  searchTerm: string
): Promise<Array<Content | List>> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

  if (!searchTerm) {
    return [];
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // const contentResults = mockContent.filter(
  //   (item) =>
  //     item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.genres.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.description?.toLowerCase().includes(lowerCaseSearchTerm),
  // )

  const listResults = mockLists.filter(
    (list) =>
      list.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      list.description.toLowerCase().includes(lowerCaseSearchTerm)
  );

  return [...listResults];
}
