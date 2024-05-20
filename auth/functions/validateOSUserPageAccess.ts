import { OSUser } from "../types"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"

export default function validateOSUserPageAccess(user: OSUser, pathname: string) {
  const basePath = pathname.split("/")?.[1]

  let hasAccess: boolean = false

  if (basePath === "portal") {
    const portalConfig = getPortalConfigFromPathname(pathname)
    if (portalConfig) {
      if (user.role?.type === "portal") {
        if (user.role.portalId === portalConfig.id) {
          hasAccess = true
        }
      } else {
        hasAccess =
          user.role?.isAdmin || !!user.role?.accessiblePortalIds?.includes(portalConfig?.id)
      }
    }
  }

  if (basePath === "console") {
    if (user.role?.type === "console") {
      const userRestrictedPaths = user.role.restrictedConsolePages ?? []
      hasAccess = !userRestrictedPaths?.includes(pathname)
    }
  }

  if (basePath !== "portal" && basePath !== "console") {
    hasAccess = true
  }

  return hasAccess
}
