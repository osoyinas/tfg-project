"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReviewDialog } from "@/components/review-dialog";
import { ActionButtonsRow } from "@/components/content/action-buttons-row";
import { cn } from "@/lib/utils";
import { createReview } from "@/services/reviews";
import { toast } from "@/hooks/use-toast";


interface ContentDetailProps {
  id: string;
  title: string;
  creators?: string[];
  genres?: string[];
  releaseDate?: string;
  rating: number; // 0-5
  images: ContentImages;
  description?: string;
  onShare?: () => void;
  onBookmark?: () => void;
  contentType: "book" | "movie" | "series";
  bgClass: string; // e.g. bg-dark-book-bg
  accentColorClass: string; // e.g. text-book-green
  focusColorClass: string; // e.g. focus:border-book-green
  details: ReactNode; // Custom details section
  reviewsSection?: ReactNode; // Custom reviews section (optional)
  children?: ReactNode; // For further extension
}

import { useSavedItems } from "./saved-items-provider";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { ContentImages } from "@/types";
import { ReviewsList } from "./content/reviews-list";

export function ContentDetail({
    id,
  title,
  creators = [],
  genres = [],
  releaseDate = "",
  rating,
  description = "",
  images,
//   userLists,
  onShare,
  onBookmark,
  contentType,
  bgClass,
  accentColorClass,
  focusColorClass,
  details,
  children,
}: ContentDetailProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);

  const { addItem, removeItem, isSaved } = useSavedItems();
  const saved = isSaved(id);
  const isPanoramic = Boolean(images?.cover?.url);
  const thumbnailUrl = images?.thumbnail?.url || images?.poster?.url || "/placeholder.svg";

  const axios = useAuthAxios();
  const handleOnBookmark = () => {
    if (saved) {
      removeItem(id);
    } else {
      addItem({
        id,
        type: contentType,
        title,
        image: images?.thumbnail?.url || images?.poster?.url || images?.cover?.url || "/placeholder.svg",
      });
    }
    onBookmark?.();
  };

  const handleOnReview = async (rating: number, review: string, spoilers: boolean) => {
    if (rating && review) {
      try {
        await createReview({
          id,
          rating,
          text: review,
          spoilers
        }, axios);
        toast({
          title: "Reseña enviada",
          description: "Tu reseña ha sido enviada con éxito.",
          variant: "default"
        });
      } catch (error: any) {
        toast({
          title: "Error al enviar reseña",
          description: error?.message || "Ocurrió un error inesperado. Intenta de nuevo.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className={cn(`w-full min-h-screen ${bgClass} text-dark-foreground mb-16`)}>
      <div className="container mx-auto px-4 py-8">
        {isPanoramic && (
          <div className="w-full mb-8 relative hidden md:block">
            <img
              src={images?.cover?.url}
              alt={title}
              className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),rgba(0,0,0,0))] [mask-repeat:no-repeat] [mask-size:100%] max-h-[400px]"
              style={{ display: 'block', width: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex justify-center items-start">
            <img
              src={thumbnailUrl}
              alt={title}
              className="shadow-lg object-cover w-full h-auto max-w-xs max-h-[60vh] sm:max-h-[450px] rounded-lg"
              style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '60vh' }}
            />
          </div>
          <div className="md:col-span-2">
            <h1 className={`text-4xl font-bold mb-2 ${accentColorClass}`}>{title}</h1>
            <p className="text-dark-muted-foreground text-lg mb-4">
              {creators.length > 0 ? creators.slice(0, 2).join(", ") + (creators.length > 2 ? "…" : "") + " • " : ""}
              {genres.length > 0 ? genres.join(", ") + " • " : ""}
              {releaseDate
                ? new Date(releaseDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                className="flex items-center gap-1 text-yellow-500 focus:outline-none"
                onClick={() => setIsReviewModalOpen(true)}
                title="Escribir una reseña"
                aria-label="Escribir una reseña"
              >
                <Star className="h-6 w-6 fill-yellow-500" />
                <span className="text-2xl font-bold">{(rating / 2).toFixed(1)}</span>
              </button>
              <Separator orientation="vertical" className="h-6 bg-dark-border" />
              <ActionButtonsRow
                onReviewClick={() => setIsReviewModalOpen(true)}
                // onAddToListClick={() => setIsAddToListModalOpen(true)}
                onShareClick={() => onShare?.()}
                onBookmarkClick={handleOnBookmark}
                contentType={contentType}
                isBookmarked={saved}
              />
            </div>
            <p className="text-dark-foreground leading-relaxed mb-6">{description}</p>
            <div className="grid grid-cols-2 gap-4 text-dark-foreground mb-6">
              {details}
            </div>
            <Separator className="my-8 bg-dark-border" />
            <ReviewsList itemId={id} />
          </div>
        </div>
        {children}
      </div>
      <ReviewDialog
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        title={title}
        accentColorClass={accentColorClass}
        focusColorClass={focusColorClass}
  onSubmit={(rating, review, spoilers) => handleOnReview?.(rating, review, spoilers)}
      />
      {/* Add to List Modal */}
      <Dialog open={isAddToListModalOpen} onOpenChange={setIsAddToListModalOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
          <DialogHeader>
            <DialogTitle className="text-dark-primary">
              Añadir {title} a una Lista
            </DialogTitle>
            <DialogDescription className="text-dark-muted-foreground">
              Selecciona una lista existente o crea una nueva.
            </DialogDescription>
          </DialogHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list" className="text-right text-dark-foreground">
                Lista
              </Label>
              <Select onValueChange={setSelectedList}>
                <SelectTrigger className={`col-span-3 bg-dark-input border-dark-border text-dark-foreground ${focusColorClass} focus:ring-0`}>
                  <SelectValue placeholder="Selecciona una lista" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border text-dark-foreground">
                  {userLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new-list" className="font-semibold text-dark-primary">
                    + Crear Nueva Lista
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
