"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { UserAccessToken } from "../types"
import { userAccessTokensFirestoreCollectionPath } from "../constants"

export default async function _getUserAccessToken(userId: string): Promise<UserAccessToken | null> {
  const { sysFirestore } = new _FirebaseAdmin()

  const tokenQuery = await sysFirestore
    .collection(userAccessTokensFirestoreCollectionPath)
    .where("userId", "==", userId)
    .get()

  if (tokenQuery.empty) return null

  const tokenDoc = tokenQuery.docs[0]
  return tokenDoc.data() as UserAccessToken
}
