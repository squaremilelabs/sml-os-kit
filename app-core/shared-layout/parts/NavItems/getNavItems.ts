import { NavGroup, NavItem } from "@/~sml-os-kit/config/site/types"
import siteConfig from "@/$sml-os-config/site"
import { OSUser } from "@/~sml-os-kit/auth/types"
import validateOSUserPageAccess from "@/~sml-os-kit/auth/functions/validateOSUserPageAccess"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"

export default function getNavItems(user: OSUser, pathname: string): NavItem[] {
  let baseNavigation: NavItem[] = []
  const basePath = pathname.split("/")[1]

  if (basePath === "console") {
    if (user.role?.type === "console") {
      baseNavigation = siteConfig.console.navigation
    }
  }

  if (basePath === "portal") {
    const portal = getPortalConfigFromPathname(pathname)
    if (portal) {
      baseNavigation = portal.navigation
    }
  }

  const result: NavItem[] = []

  for (const navItem of baseNavigation) {
    if (navItem.type === "group") {
      const groupItems: NavGroup["items"] = []
      for (const innerItem of navItem.items) {
        if (innerItem.href) {
          if (innerItem.type === "page") {
            const userHasAccess = validateOSUserPageAccess(user, innerItem.href)
            if (userHasAccess) {
              groupItems.push(innerItem)
            }
          } else {
            // type == href
            groupItems.push(innerItem)
          }
        }
      }
      if (groupItems.length === 0) continue
      result.push({ ...navItem, items: groupItems })
    } else {
      if (navItem.href) {
        if (navItem.type === "page") {
          const userHasAccess = validateOSUserPageAccess(user, navItem.href)
          if (userHasAccess) {
            result.push(navItem)
          }
        } else {
          result.push(navItem)
        }
      }
    }
  }
  return result
}
