"use client"

import clsx from "clsx"
import { StyleProvider } from "../styles/provider"
import React, { Suspense } from "react"
import { fontSans } from "../styles/font"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Metadata, Viewport } from "next"
import brandConfig from "@/$sml-os-config/brand"

export const metadata: Metadata = {
  title: {
    default: brandConfig.appName,
    template: `%s | ${brandConfig.appName}`,
  },
  icons: {
    icon: brandConfig.assetPaths.logoOnLight,
    shortcut: brandConfig.assetPaths.logoOnLight,
    apple: brandConfig.assetPaths.logoOnLight,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

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
