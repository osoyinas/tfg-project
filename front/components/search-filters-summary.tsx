import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


interface SearchFiltersSummaryProps {
  minScore: number;
  maxScore: number;
  minYear: string;
  maxYear: string;
  onClear: (key: string) => void;
}


export function SearchFiltersSummary({ minScore, maxScore, minYear, maxYear, onClear }: SearchFiltersSummaryProps) {


  const filters = [];
  // Mostrar ordenación legible
  if (minScore > 0) filters.push({ key: "minScore", label: `Puntuación ≥ ${minScore}` });
  if (maxScore < 5) filters.push({ key: "maxScore", label: `Puntuación ≤ ${maxScore}` });
  if (minYear) filters.push({ key: "minYear", label: `Año desde ${minYear}` });
  if (maxYear) filters.push({ key: "maxYear", label: `Año hasta ${maxYear}` });

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map(f => (
        <span key={f.key} className="inline-flex items-center bg-dark-accent text-dark-foreground rounded px-3 py-1 text-xs font-medium">
          {f.label}
          <Button size="icon" variant="ghost" className="ml-1 p-0 h-4 w-4" onClick={() => onClear(f.key)} aria-label="Quitar filtro">
            <X className="h-3 w-3" />
          </Button>
        </span>
      ))}
    </div>
  );
}
