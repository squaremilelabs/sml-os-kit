"use server"

import _FirebaseAdmin from "../../firebase/_FirebaseAdmin"
import { defaultSessionCookieExpiration } from "../constants"

export default async function _createSessionCookieFromIdToken(
  idToken: string,
  expiresIn?: number
): Promise<string> {
  const { auth } = new _FirebaseAdmin()
  const cookie = await auth.createSessionCookie(idToken, {
    expiresIn: expiresIn || defaultSessionCookieExpiration,
  })
  return cookie
}
