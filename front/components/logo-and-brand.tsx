import Link from "next/link"
import { Film } from "lucide-react"

export function LogoAndBrand() {
  return (
    <Link href="/" className="flex items-center gap-2 text-dark-foreground hover:text-dark-primary transition-colors">
      <Film className="h-6 w-6 text-dark-primary" />
      <span className="text-lg font-semibold">MovieBookSeries</span>
    </Link>
  )
}
