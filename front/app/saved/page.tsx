'use client'
import { useSavedItems } from '../../components/saved-items-provider';
import { Card } from '../../components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function SavedPage() {
  const { savedItems, removeItem } = useSavedItems();

  if (savedItems.length === 0) {
    return <div className="p-6 text-center">No has guardado ningún contenido aún.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Guardados</h1>
      <div className="grid gap-4">
  {savedItems.map((item) => (
          <Card key={item.id} className="flex items-center gap-4 p-4">
            {item.image && (
              <Image src={item.image} alt={item.title} width={60} height={90} className="rounded" />
            )}
            <div className="flex-1">
              <Link href={`/${item.type}s/${item.id}`} className="font-semibold hover:underline">
                {item.title}
              </Link>
              <div className="text-xs text-muted-foreground capitalize">{item.type}</div>
            </div>
            <button
              className="text-red-500 hover:underline text-xs"
              onClick={() => removeItem(item.id)}
            >
              Quitar
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
