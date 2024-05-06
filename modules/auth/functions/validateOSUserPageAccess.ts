import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import { OSUser } from "../types"

export default function validateOSUserPageAccess(user: OSUser, pathname: string) {
  const siteConfig = getSiteConfig()
  const pageType = pathname.split("/")?.[1]

  let hasAccess: boolean = false

  if (pageType === "portal") {
    const portalConfig = siteConfig.portals?.find((portal) => pathname.startsWith(portal.basePath))
    hasAccess =
      // User is an admin (attempting to use admin agent in portal page)
      user.role?.userType === "admin" ||
      // User is a portal user; make sure they are entering the correct portal
      (user.role?.userType === "portal" && portalConfig?.id === user.role?.portalId)
  }

  if (pageType === "admin") {
    const userRestrictedPaths = user.role?.restrictedAdminPagePaths ?? []
    hasAccess = user.role?.userType === "admin" && !userRestrictedPaths?.includes(pathname)
  }

  return hasAccess
}
