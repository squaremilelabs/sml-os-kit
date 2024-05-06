import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import { OSUser } from "../types"

export function getOSUserHomePagePath(user: OSUser) {
  const siteConfig = getSiteConfig()

  if (user.role?.userType === "admin") {
    return "/admin"
  }

  if (user.role?.userType === "portal") {
    const portalPage = siteConfig.portals?.find((portal) => portal.id === user.role?.portalId)

    if (portalPage?.basePath) {
      return portalPage.basePath
    }
  }

  throw new Error("Failed to route")
}
