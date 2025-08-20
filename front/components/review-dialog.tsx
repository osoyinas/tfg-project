import { useState } from "react";
import Rating from "@mui/material/Rating";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  accentColorClass: string;
  focusColorClass: string;
  onSubmit: (rating: number, review: string, spoilers: boolean) => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  title,
  accentColorClass,
  focusColorClass,
  onSubmit,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [spoilers, setSpoilers] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
        <DialogHeader>
          <DialogTitle className="text-dark-primary">
            Escribir una Reseña para {title}
          </DialogTitle>
          <DialogDescription className="text-dark-muted-foreground">
            Comparte tus pensamientos y califica este contenido.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center gap-4 w-full flex justify-center">
              <Rating
                name="rating"
                value={rating}
                precision={0.5}
                onChange={(
                  _event: React.SyntheticEvent,
                  value: number | null
                ) => setRating(value ?? 0)}
                size="large"
              />
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="review"
              placeholder="Escribe tu reseña aquí..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className={`col-span-4 bg-dark-input border-dark-border text-dark-foreground ${focusColorClass} focus:ring-0`}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="spoilers"
              className="text-right text-dark-foreground"
            >
              ¿Tu comentario tiene spoilers?
            </Label>
            <div className="col-span-3 flex items-center">
              <Checkbox
                id="spoilers"
                checked={spoilers}
                onCheckedChange={(checked) => setSpoilers(!!checked)}
                className="mr-2"
              />
              <span className="text-sm text-dark-muted-foreground">
                Marca si tu reseña contiene spoilers
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className={`${accentColorClass.replace(
              "text-",
              "bg-"
            )} text-dark-primary-foreground hover:opacity-90`}
            onClick={() => {
              onSubmit(rating, review, spoilers);
              setRating(0);
              setReview("");
              setSpoilers(false);
              onOpenChange(false);
            }}
          >
            Enviar Reseña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
