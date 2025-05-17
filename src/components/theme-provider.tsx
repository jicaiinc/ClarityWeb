"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes" 
import { STORAGE_KEYS } from "~lib/storage"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props} storageKey={STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.THEME}>{children}</NextThemesProvider>
} 