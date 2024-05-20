import { getColorThemes } from "@/~sml-os-kit/config/theme/functions"
import { Head, Html, Preview, Tailwind } from "@react-email/components"
import React from "react"

const lightTheme = getColorThemes().light
const colors = lightTheme?.colors

export default function EmailRoot({
  previewText,
  children,
}: {
  previewText: string
  children: React.ReactNode
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={{ theme: { extend: { colors } } }}>{children}</Tailwind>
    </Html>
  )
}
