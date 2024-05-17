"use client"

import { StyleProvider } from "../styles/provider"
import { fontSans } from "../styles/font"
import React, { Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { twMerge } from "tailwind-merge"

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={twMerge("h-screen font-sans text-foreground", fontSans.variable)}>
        <Suspense>
          <QueryClientProvider client={queryClient}>
            <StyleProvider>{children}</StyleProvider>
          </QueryClientProvider>
        </Suspense>
      </body>
    </html>
  )
}
