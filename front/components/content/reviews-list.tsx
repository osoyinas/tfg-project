import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/services/reviews";
import { getItemsByIds } from "@/services/getItems";
import { ReviewCard } from "@/components/content/review-card";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { Review, ContentItem } from "@/types";
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";

export interface ReviewsListHandle {
  refetch: () => void;
}

interface ReviewsListProps {
  itemId?: string;
  justMine?: boolean;
  withItems?: boolean;
  page?: number;
  size?: number;
}

export const ReviewsList = forwardRef<ReviewsListHandle, ReviewsListProps>(
  (
    { itemId, justMine, page = 0, size = 20, withItems = false },
    ref: ForwardedRef<ReviewsListHandle>
  ) => {
    const axios = useAuthAxios();
    const filters = {
      itemId,
      justMine,
      page,
      size,
    };

    const {
      data: reviews,
      isLoading,
      isError,
      error,
      refetch,
    } = useQuery<Review[], Error>({
      queryKey: ["reviews", itemId, page, size],
      queryFn: () => getReviews(filters, axios),
    });

    // Estado para los items si withItems
    const [itemsMap, setItemsMap] = useState<Record<
      string,
      ContentItem
    > | null>(null);

    useEffect(() => {
      console.log("[ReviewsList] withItems:", withItems, "reviews:", reviews);
      if (withItems && reviews && reviews.length > 0) {
        const ids = Array.from(new Set(reviews.map((r) => r.catalogItemId)));
        console.log("[ReviewsList] Fetching items for ids:", ids);
        getItemsByIds(ids, axios)
          .then((itemsArr) => {
            // Simplificado: si la respuesta tiene .items y es array, úsala; si no, usa el array directamente
            let arr: ContentItem[] = [];
            if (
              itemsArr &&
              typeof itemsArr === "object" &&
              "items" in itemsArr &&
              Array.isArray((itemsArr as any).items)
            ) {
              arr = (itemsArr as any).items;
            } else if (Array.isArray(itemsArr)) {
              arr = itemsArr;
            }
            // Mapea por id
            const map: Record<string, ContentItem> = {};
            arr.forEach((item) => {
              if (item && item.id) map[item.id] = item;
            });
            setItemsMap(map);
          })
          .catch((err) => {
            setItemsMap(null);
          });
      } else {
        console.log(
          "[ReviewsList] No withItems or no reviews, skipping items fetch"
        );
        setItemsMap(null);
      }
    }, [withItems, reviews, axios]);

    useImperativeHandle(ref, () => ({
      refetch,
    }));

    if (isLoading)
      return <div className="text-center py-8">Cargando reseñas...</div>;
    if (isError)
      return (
        <div className="text-center text-red-500 py-8">
          Error al cargar reseñas: {error?.message}
        </div>
      );
    if (!reviews || (Array.isArray(reviews) && reviews.length === 0))
      return (
        <div className="text-center text-dark-muted-foreground py-8">
          No hay reseñas todavía.
        </div>
      );

    // Debug logs para render
    if (withItems) {
      console.log(
        "[ReviewsList] Render: withItems=TRUE, itemsMap=",
        itemsMap,
        "reviews=",
        reviews
      );
    }
    if (withItems && (!itemsMap || Object.keys(itemsMap).length === 0)) {
      return <div className="text-center py-8">Cargando contenido…</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        {Array.isArray(reviews) &&
          reviews.map((review: Review) => (
            <ReviewCard
              key={review.id}
              review={review}
              item={withItems ? itemsMap?.[review.catalogItemId] : undefined}
            />
          ))}
      </div>
    );
  }
);
ReviewsList.displayName = "ReviewsList";
