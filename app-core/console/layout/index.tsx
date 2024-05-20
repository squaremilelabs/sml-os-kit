import brandConfig from "@/$sml-os-config/brand"
import SharedLayout from "@/~sml-os-kit/app-core/shared-layout"
import AuthWrapper from "@/~sml-os-kit/auth/wrapper"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: {
    default: "Console",
    template: `%s | Console | ${brandConfig.appName}`,
  },
}

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <SharedLayout>{children}</SharedLayout>
    </AuthWrapper>
  )
}
