import PortalWrapper from "@/~sml-os-kit/app-core/portal/layout/parts/PortalWrapper"
import SharedLayout from "@/~sml-os-kit/app-core/shared-layout"
import AuthWrapper from "@/~sml-os-kit/auth/wrapper"
import React from "react"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <PortalWrapper>
        <SharedLayout>{children}</SharedLayout>
      </PortalWrapper>
    </AuthWrapper>
  )
}
