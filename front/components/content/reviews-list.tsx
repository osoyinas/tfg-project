import { useQuery } from '@tanstack/react-query';
import { getReviews } from '@/services/reviews';
import { ReviewCard } from '@/components/content/review-card';
import { useAuthAxios } from '@/hooks/useAuthAxios';
import { Review } from '@/types';

interface ReviewsListProps {
  itemId: string;
  page?: number;
  size?: number;
}

export function ReviewsList({ itemId, page = 0, size = 20 }: ReviewsListProps) {
  const axios = useAuthAxios();
  const filters = {
    itemId,
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
    queryKey: ['reviews', itemId, page, size],
    queryFn: () => getReviews(itemId, filters, axios),
  });

  if (isLoading) return <div className="text-center py-8">Cargando reseñas...</div>;
  if (isError) return <div className="text-center text-red-500 py-8">Error al cargar reseñas: {error?.message}</div>;
  if (!reviews || (Array.isArray(reviews) && reviews.length === 0)) return <div className="text-center text-dark-muted-foreground py-8">No hay reseñas todavía.</div>;

  return (
    <div className="flex flex-col gap-4">
      {Array.isArray(reviews) && reviews.map((review: Review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
