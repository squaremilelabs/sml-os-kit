import brandConfig from "@/$sml-os-config/brand"
import { Metadata } from "next"

const rootMetadata: Metadata = {
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

export default rootMetadata
