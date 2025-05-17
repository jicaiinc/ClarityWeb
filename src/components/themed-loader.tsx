import { Loader2 } from "lucide-react"
import { ThemeProvider } from "./theme-provider"

export function ThemedLoader() {
  return (
    <ThemeProvider attribute="class">
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </ThemeProvider>
  )
}