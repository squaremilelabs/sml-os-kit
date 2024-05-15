"use client"

import "./tailwind.css"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import React from "react"

export function StyleProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
      </NextThemeProvider>
    </NextUIProvider>
  )
}
