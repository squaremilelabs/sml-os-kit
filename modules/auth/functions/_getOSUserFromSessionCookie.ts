"use server"

import { BaseOSUser, OSUser } from "../types"
import roles from "@/$sml-os-config/roles"
import _getUserFromSessionCookie from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_getUserFromSessionCookie"

export default async function _getOSUserFromSessionCookie(
  cookie: string | undefined
): Promise<OSUser | null> {
  if (typeof cookie === "undefined") return null
  const baseUser = await _getUserFromSessionCookie<BaseOSUser>(cookie)
  const role = roles.find((role) => role.id === baseUser?.roleId)
  if (!role) return null
  return { ...baseUser, role } as OSUser
}
