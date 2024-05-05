"use client"

import FirebaseClient from "@/~sml-os-kit/~sml-firebase/firebase/FirebaseClient"

export default async function getIdTokenFromSignInLink(link: string): Promise<string | null> {
  const { auth } = new FirebaseClient()
  if (!auth.isSignInWithEmailLink(link)) return null

  const url = new URL(link)
  const email = url.searchParams.get("email") as string
  if (!email) return null

  const { user } = await auth.signInWithEmailLink(email, link)
  const idToken = await user.getIdToken(true)
  return idToken
}
