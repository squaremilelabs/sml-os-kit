"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { UserAccessToken } from "../types"
import { userAccessTokensFirestoreCollectionPath } from "../constants"
import { v4 as uuid } from "uuid"
import { createId } from "@paralleldrive/cuid2"

export default async function _createOrGetUserAccessToken(
  userId: string
): Promise<UserAccessToken> {
  const { sysFirestore } = new _FirebaseAdmin()

  const tokenQuery = await sysFirestore
    .collection(userAccessTokensFirestoreCollectionPath)
    .where("userId", "==", userId)
    .get()

  if (!tokenQuery.empty) {
    const tokenDoc = tokenQuery.docs[0]
    return tokenDoc.data() as UserAccessToken
  }

  const tokenId = createId()
  const tokenData: UserAccessToken = {
    id: tokenId,
    userId,
    accessToken: uuid(),
    createdAt: Date.now(),
  }

  await sysFirestore.collection(userAccessTokensFirestoreCollectionPath).doc(tokenId).set(tokenData)
  return tokenData
}
