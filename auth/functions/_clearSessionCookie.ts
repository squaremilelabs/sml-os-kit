"use server"

import { authCookieName } from "@/~sml-os-kit/config/auth/constants"
import { cookies } from "next/headers"

export default async function _clearSessionCookie() {
  cookies().delete(authCookieName)
}
