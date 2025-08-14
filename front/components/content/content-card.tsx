import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ContentType } from "@/types";

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    imageUrl: string;
    type: ContentType;
    rating?: number;
  };
}

export function ContentCard({ content }: ContentCardProps) {
  const getLinkPath = () => {
    switch (content.type) {
      case "MOVIE":
        return `/movies/${content.id}`;
      case "BOOK":
        return `/books/${content.id}`;
      case "TV_SERIE":
        return `/series/${content.id}`;
      default:
        return "#";
    }
  };

  const getAccentColorClass = () => {
    switch (content.type) {
      case "MOVIE":
        return "text-movie-red";
      case "BOOK":
        return "text-book-green";
      case "TV_SERIE":
        return "text-series-blue";
      default:
        return "text-dark-primary";
    }
  };

  const getLabel = () => {
    switch (content.type) {
      case "MOVIE":
        return "Película";
      case "BOOK":
        return "Libro";
      case "TV_SERIE":
        return "Serie";
      default:
        return "Contenido";
    }
  };

  return (
    <Link href={getLinkPath()} className="block bg-red-700">
      <Card className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg group bg-dark-card border-dark-border hover:border-dark-primary transition-all duration-200">
        <img
          src={content.imageUrl || "/placeholder.svg"}
          alt={content.title}
          width={200}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
          <h3 className="text-white text-base font-semibold line-clamp-2 mb-1">
            {content.title}
          </h3>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-medium capitalize",
                getAccentColorClass()
              )}
            >
              {getLabel()}
            </span>
            {content.rating && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-3 w-3 fill-yellow-400" />
                <span className="text-xs font-semibold">
                  {(content.rating / 2).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
