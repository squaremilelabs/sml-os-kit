import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import { AdminNavItem } from "@/~sml-os-kit/config/types"
import validateOSUserPageAccess from "./validateOSUserPageAccess"
import { OSUser } from "../types"

export default function getAdminNavigationForOSUser(user: OSUser) {
  const { admin: adminSiteConfig } = getSiteConfig()
  const { navigation } = adminSiteConfig

  const result: AdminNavItem[] = []

  for (const navItem of navigation) {
    if (navItem.type === "group" && navItem.items?.length) {
      const groupItems: AdminNavItem[] = []
      for (const groupItem of navItem.items) {
        if (groupItem.href) {
          if (groupItem.type === "page") {
            const userHasAccess = validateOSUserPageAccess(user, groupItem.href)
            if (userHasAccess) {
              groupItems.push(groupItem)
            }
          } else {
            // type == href
            groupItems.push(groupItem)
          }
        }
      }
      if (groupItems.length === 0) continue
      if (groupItems.length === 1) {
        // insert outside of group
        result.push(groupItems[0])
      } else {
        result.push({ ...navItem, items: groupItems })
      }
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
