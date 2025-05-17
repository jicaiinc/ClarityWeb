import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectedImagesProps {
  images: { id: string; data: string }[]
  onRemove: (id: string) => void
}

export function SelectedImages({ images, onRemove }: SelectedImagesProps) {
  if (images.length === 0) return null

  return (
    <div className="relative mb-2 p-3 bg-secondary rounded-lg">
      <div className="flex overflow-x-auto gap-2">
        {images.map((image) => (
          <div key={image.id} className="relative flex-shrink-0">
            <img
              src={image.data}
              alt="Screenshot"
              className="h-20 w-auto rounded border border-border"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 p-0 bg-background/80 hover:bg-background"
              onClick={() => onRemove(image.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
