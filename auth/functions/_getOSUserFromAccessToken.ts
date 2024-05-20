"use server"
import _getUserFromAccessToken from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_getUserFromAccessToken"
import { BaseOSUser, OSUser } from "../types"
import getRoleById from "@/~sml-os-kit/auth/functions/getRoleById"

export default async function _getOSUserFromAccessToken(
  token: string | undefined
): Promise<OSUser | null> {
  if (typeof token === "undefined") return null
  const baseUser = await _getUserFromAccessToken<BaseOSUser>(token)
  if (!baseUser?.roleId) return null
  const role = getRoleById(baseUser.roleId)
  if (!role) return null
  return { ...baseUser, role } as OSUser
}
