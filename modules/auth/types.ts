import { User } from "@/~sml-os-kit/~sml-firebase/auth/types"

export interface BaseOSUser extends User {
  roleId: string
  isSML?: boolean
}

export interface OSRole {
  id: string
  label: string
  userType: "admin" | "portal"
  restrictedAdminPagePaths?: string[] // optional for admin roles with limited access
  portalId?: string // required for all portal users
}

export interface OSUser extends BaseOSUser {
  role: OSRole | null
}
