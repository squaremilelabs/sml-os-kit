import _getUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_getUser"
import { BaseOSUser, OSUser } from "../types"
import roles from "@/$sml-os-config/roles"

export default async function _getOSUser(userId: string): Promise<OSUser | null> {
  const baseUser = await _getUser<BaseOSUser>(userId)
  const role = roles.find((role) => role.id === baseUser?.roleId)
  if (!role) return null
  return { ...baseUser, role } as OSUser
}
