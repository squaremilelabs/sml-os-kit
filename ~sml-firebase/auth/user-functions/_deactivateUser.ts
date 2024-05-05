"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { usersFirestoreCollectionPath } from "../constants"
import { User } from "../types"

export default async function _deactivateUser<ExtUser extends User>(
  userId: string
): Promise<ExtUser> {
  const { auth, sysFirestore } = new _FirebaseAdmin()
  const userRef = sysFirestore.collection(usersFirestoreCollectionPath).doc(userId)
  const userDoc = await userRef.get()
  if (!userDoc.exists) throw new Error("User does not exist in database")

  await auth.updateUser(userId, { disabled: true })
  await userRef.update({ isDeactivated: true })

  return { ...userDoc.data(), isDeactivated: true } as ExtUser
}
