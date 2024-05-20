import siteConfig from "@/$sml-os-config/site"
import { PortalConfig } from "@/~sml-os-kit/config/site/types"

export default function getPortalConfigFromPathname(pathname: string): PortalConfig | null {
  if (!siteConfig.portals) return null
  const portalEntries = Array.from(siteConfig.portals.entries())
  const targetEntry = portalEntries.find(([id, config]) => pathname.startsWith(config.basePath))
  if (!targetEntry) return null
  return targetEntry[1]
}
