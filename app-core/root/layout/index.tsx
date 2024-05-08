"use client"

import clsx from "clsx"
import { StyleProvider } from "../styles/provider"
import React, { Suspense } from "react"
import { fontSans } from "../styles/font"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={clsx("h-screen font-sans text-foreground", fontSans.variable)}>
        <Suspense>
          <QueryClientProvider client={queryClient}>
            <StyleProvider>{children}</StyleProvider>
          </QueryClientProvider>
        </Suspense>
      </body>
    </html>
  )
}
