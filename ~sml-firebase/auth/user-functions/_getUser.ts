"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { usersFirestoreCollectionPath } from "../constants"
import { User } from "../types"

export default async function _getUser<ExtUser extends User>(
  userId: string
): Promise<ExtUser | null> {
  const { sysFirestore } = new _FirebaseAdmin()
  const userDoc = await sysFirestore.collection(usersFirestoreCollectionPath).doc(userId).get()
  if (!userDoc.exists) return null
  return userDoc.data() as ExtUser
}
