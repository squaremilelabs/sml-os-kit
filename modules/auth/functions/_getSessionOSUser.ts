"use server"

import _getUserFromSessionCookie from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_getUserFromSessionCookie"
import { getCookieName } from "@/~sml-os-kit/config/functions"
import { cookies } from "next/headers"
import _getOSUserFromSessionCookie from "./_getOSUserFromSessionCookie"

export default async function _getSessionOSUser() {
  const cookie = cookies().get(getCookieName())
  return _getOSUserFromSessionCookie(cookie?.value)
}
