import brandConfig from "@/$sml-os-config/brand"
import { Metadata, Viewport } from "next"

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
