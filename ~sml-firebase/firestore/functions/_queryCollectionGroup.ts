"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import constructFirestoreQuery, { FirestoreQueryParams } from "../utilties/constructFirestoreQuery"

export default async function queryCollection(
  collectionGroupName: string,
  queryParams: FirestoreQueryParams
): Promise<any[]> {
  const { appFirestore } = new _FirebaseAdmin()
  const collectionGroup = appFirestore.collectionGroup(collectionGroupName)
  const query = constructFirestoreQuery(collectionGroup, queryParams)
  const queryResult = await query.get()
  const queryDocs = queryResult.docs
  return queryDocs.map((doc) => doc.data())
}
