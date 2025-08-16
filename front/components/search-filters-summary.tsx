import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SearchFiltersSummaryProps {
  orderBy: string;
  minScore: number;
  maxScore: number;
  minDate: string;
  maxDate: string;
  onClear: (key: string) => void;
}

export function SearchFiltersSummary({ orderBy, minScore, maxScore, minDate, maxDate, onClear }: SearchFiltersSummaryProps) {
  function formatDateLocal(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
  }


  const filters = [];
  // Mostrar ordenación legible
  if (orderBy && orderBy !== "" && orderBy !== "relevance") {
    let label = "";
    if (orderBy.startsWith("date")) {
      label = `Fecha ${orderBy.endsWith("asc") ? "↑" : "↓"}`;
    } else if (orderBy.startsWith("RATING")) {
      label = `Puntuación ${orderBy.endsWith("asc") ? "↑" : "↓"}`;
    } else {
      label = orderBy;
    }
    filters.push({ key: "orderBy", label });
  }
  if (minScore > 0) filters.push({ key: "minScore", label: `Puntuación ≥ ${minScore}` });
  if (maxScore < 5) filters.push({ key: "maxScore", label: `Puntuación ≤ ${maxScore}` });
  if (minDate) filters.push({ key: "minDate", label: `Desde ${formatDateLocal(minDate)}` });
  if (maxDate) filters.push({ key: "maxDate", label: `Hasta ${formatDateLocal(maxDate)}` });

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
