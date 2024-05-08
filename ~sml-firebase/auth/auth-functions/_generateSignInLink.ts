"use server"
import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"

export default async function _generateSignInlink(
  redirectUrl: string,
  email: string
): Promise<string> {
  const { auth } = new _FirebaseAdmin()
  const signInLink = await auth.generateSignInWithEmailLink(email, {
    url: `${redirectUrl}?email=${email}`,
    handleCodeInApp: true,
  })
  return signInLink
}
