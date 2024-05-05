"use server"

import _getUserFromAccessToken from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_getUserFromAccessToken"
import { BaseOSUser, OSUser } from "../types"
import roles from "@/$sml-os-config/roles"

export default async function _getOSUserFromAccessToken(
  token: string | undefined
): Promise<OSUser | null> {
  if (typeof token === "undefined") return null
  const baseUser = await _getUserFromAccessToken<BaseOSUser>(token)
  const role = roles.find((role) => role.id === baseUser?.roleId)
  if (!role) return null
  return { ...baseUser, role } as OSUser
}
