"use server"
import _createSessionCookieFromIdToken from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_createSessionCookieFromIdToken"
import { cookies } from "next/headers"
import { authCookieName } from "@/~sml-os-kit/config/auth/constants"

export default async function _setSessionCookieFromIdToken(idToken: string) {
  const sessionCookie = await _createSessionCookieFromIdToken(idToken)
  cookies().set(authCookieName, sessionCookie, { maxAge: 60 * 60 * 24 * 14 })
}
