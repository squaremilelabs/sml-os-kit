"use server"

import _getUserFromSessionCookie from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_getUserFromSessionCookie"
import { getCookieName } from "@/~sml-os-kit/config/functions"
import { cookies } from "next/headers"
import _getOSUserFromSessionCookie from "./_getOSUserFromSessionCookie"
import { createId } from "@paralleldrive/cuid2"
import roles from "@/$sml-os-config/roles"
import { OSUser } from "@/~sml-os-kit/modules/auth/types"

export default async function _getSessionOSUser() {
  if (process.env.OS_DEMO_MODE) {
    const demoRole = roles.find((role) => role.id === "demo")
    if (demoRole) {
      return {
        id: createId(),
        createdAt: Date.now(),
        isDeactivated: false,
        displayName: "Demo",
        email: "demo@smlabs.app",
        roleId: "demo",
        role: demoRole,
      } as OSUser
    }
  }
  const cookie = cookies().get(getCookieName())
  return _getOSUserFromSessionCookie(cookie?.value)
}
