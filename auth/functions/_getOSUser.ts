"use server"
import _getUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_getUser"
import { BaseOSUser, OSUser } from "../types"
import getRoleById from "@/~sml-os-kit/auth/functions/getRoleById"

export default async function _getOSUser(userId: string): Promise<OSUser | null> {
  if (process.env.OS_DEMO_MODE) return null
  const baseUser = await _getUser<BaseOSUser>(userId)
  if (!baseUser?.roleId) return null
  const role = getRoleById(baseUser?.roleId)
  if (!role) return null
  return { ...baseUser, role } as OSUser
}
