import { User } from "@/~sml-os-kit/~sml-firebase/auth/types"
import { Role } from "@/~sml-os-kit/config/auth/types"

export interface BaseOSUser extends User {
  roleId: string
  isSML?: boolean
}

export interface OSUser extends BaseOSUser {
  role: Role | null
}
