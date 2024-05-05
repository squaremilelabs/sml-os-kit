"use server"

import _createSessionCookieFromIdToken from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_createSessionCookieFromIdToken"
import { getCookieName } from "@/~sml-os-kit/config/functions"
import { cookies } from "next/headers"

export default async function _setSessionCookieFromIdToken(idToken: string) {
  const cookieName = getCookieName()
  const sessionCookie = await _createSessionCookieFromIdToken(idToken)
  cookies().set(cookieName, sessionCookie, { maxAge: 60 * 60 * 24 * 14 })
}
