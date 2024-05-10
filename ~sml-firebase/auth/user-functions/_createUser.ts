"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { User } from "../types"
import { createId } from "@paralleldrive/cuid2"
import { usersFirestoreCollectionPath } from "../constants"

export default async function _createUser<ExtUser extends User>(
  input: Omit<ExtUser, "id" | "createdAt" | "isDeactivated">
): Promise<ExtUser> {
  const { auth, sysFirestore } = new _FirebaseAdmin()

  const authUser = await auth.createUser({
    displayName: input.displayName,
    email: input.email,
    password: createId(),
  })

  const userData = {
    ...input,
    id: authUser.uid,
    createdAt: Date.now(),
    isDeactivated: false,
  }

  await sysFirestore.collection(usersFirestoreCollectionPath).doc(authUser.uid).set(userData)
  return userData as ExtUser
}
