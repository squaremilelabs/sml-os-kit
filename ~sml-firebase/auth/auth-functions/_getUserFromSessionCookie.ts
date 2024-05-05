"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { User } from "../types"
import { usersFirestoreCollectionPath } from "../constants"

export default async function _getUserFromSessionCookie<ExtUser extends User>(
  sessionCookie: string
): Promise<ExtUser | null> {
  const { auth, sysFirestore } = new _FirebaseAdmin()

  const decodedIdToken = await auth.verifySessionCookie(sessionCookie) // will not throw an error if user is disabled
  if (!decodedIdToken) return null

  const { uid } = decodedIdToken
  const userDoc = await sysFirestore.collection(usersFirestoreCollectionPath).doc(uid).get()
  if (!userDoc.exists) return null
  const userData = userDoc.data() as ExtUser
  if (userData.isDeactivated) return null

  return userData as ExtUser
}
