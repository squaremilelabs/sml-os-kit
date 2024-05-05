"use server"

import _generateSignInlink from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_generateSignInLink"
import { headers } from "next/headers"

export default async function _sendSignInLink(email: string) {
  const hostUrl = headers().get("origin")
  const redirectUrl = hostUrl + "/handle-login"
  const signInLink = await _generateSignInlink(redirectUrl, email)
  return signInLink
}
