"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { User } from "../types"
import { usersFirestoreCollectionPath } from "../constants"

export default async function _updateUser<ExtUser extends User>(
  userId: string,
  input: Partial<Omit<ExtUser, "id" | "isDeactivated" | "createdAt">>
): Promise<ExtUser> {
  const { auth, sysFirestore } = new _FirebaseAdmin()

  const usersCollection = sysFirestore.collection(usersFirestoreCollectionPath)
  const userRef = usersCollection.doc(userId)
  const currentUserDoc = await userRef.get()
  if (!currentUserDoc.exists) throw new Error("User does not exist in database")

  const currentUser = currentUserDoc.data() as ExtUser

  if (input.displayName || input.email) {
    const isDisplayNameChange = input.displayName !== currentUser.displayName
    const isEmailChange = input.email !== currentUser.email

    if (isDisplayNameChange || isEmailChange) {
      await auth.updateUser(userId, {
        displayName: isDisplayNameChange ? input.displayName : undefined,
        email: isEmailChange ? input.email : undefined,
      })
    }
  }

  await userRef.update(input)
  const updatedUserDoc = await userRef.get()
  return updatedUserDoc.data() as ExtUser
}
