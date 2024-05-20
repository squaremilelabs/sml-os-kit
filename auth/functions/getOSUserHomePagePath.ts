import siteConfig from "@/$sml-os-config/site"
import { OSUser } from "../types"

export function getOSUserHomePagePath(user: OSUser) {
  if (user.role?.type === "console") {
    return "/console"
  }

  if (user.role?.type === "portal") {
    const portal = siteConfig.portals?.get(user.role.portalId)
    if (portal) {
      return portal.basePath
    }
  }

  return "/"
}
