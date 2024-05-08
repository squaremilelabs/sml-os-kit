"use server"

import _generateSignInlink from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/_generateSignInLink"
import { headers } from "next/headers"
import _sendEmail from "../../emails/functions/sendEmail"
import OSSignInEmail from "../../emails/components/composed/OSSignInEmail"
import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import brandConfig from "@/$sml-os-config/brand"
import { DateTime } from "luxon"

export default async function _sendSignInLink(email: string) {
  const { auth } = new _FirebaseAdmin()
  const user = await auth.getUserByEmail(email) // will throw error if user not found
  const hostUrl = headers().get("origin")
  const redirectUrl = hostUrl + "/handle-login"
  const signInLink = await _generateSignInlink(redirectUrl, email)
  const now = DateTime.now()
  return _sendEmail(OSSignInEmail({ displayName: user.displayName as string, signInLink }), {
    to: email,
    subject: `Sign-in to ${brandConfig.appName} [Requested: ${now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}]`,
  })
}
