import { X, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectedTextProps {
  text: string
  onClose: () => void
}

export function SelectedText({ text, onClose }: SelectedTextProps) {
  return (
    <div className="relative mb-2 p-3 bg-secondary rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          Text from your selection
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 hover:bg-secondary-foreground/10"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="mt-1 text-sm line-clamp-2">{text}</div>
    </div>
  )
}
