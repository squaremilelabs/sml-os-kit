"use server"
import { cookies } from "next/headers"
import _getOSUserFromSessionCookie from "./_getOSUserFromSessionCookie"
import { createId } from "@paralleldrive/cuid2"
import { OSUser } from "@/~sml-os-kit/auth/types"
import getRoleById from "@/~sml-os-kit/auth/functions/getRoleById"
import { authCookieName } from "@/~sml-os-kit/config/auth/constants"

export default async function _getSessionOSUser() {
  if (process.env.OS_DEMO_MODE) {
    const demoRole = getRoleById("demo")
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
  const cookie = cookies().get(authCookieName)
  return _getOSUserFromSessionCookie(cookie?.value)
}
