"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { User, UserAccessToken } from "../types"
import { userAccessTokensFirestoreCollectionPath, usersFirestoreCollectionPath } from "../constants"

export default async function _getUserFromAccessToken<ExtUser extends User>(
  token: string
): Promise<ExtUser | null> {
  const { sysFirestore } = new _FirebaseAdmin()

  const tokenQuery = await sysFirestore
    .collection(userAccessTokensFirestoreCollectionPath)
    .where("accessToken", "==", token)
    .get()
  if (tokenQuery.empty) return null

  const { userId } = tokenQuery.docs[0].data() as UserAccessToken
  const userDoc = await sysFirestore.collection(usersFirestoreCollectionPath).doc(userId).get()
  if (!userDoc.exists) return null

  return userDoc.data() as ExtUser
}
