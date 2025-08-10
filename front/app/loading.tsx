import { Loader } from "@/components/ai-elements/loader"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-dark-background">
      <Loader />
    </div>
  )
}
