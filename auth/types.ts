import { User } from "@/~sml-os-kit/~sml-firebase/auth/types"
import { Role } from "@/~sml-os-kit/config/auth/types"

/**
 * If changing these types, make sure to also update the core.zmodel AuthUser object
 * - E
 */

export interface BaseOSUser extends User {
  roleId: string
  isSML?: boolean
}

export interface OSUser extends BaseOSUser {
  role: Role | null
}
