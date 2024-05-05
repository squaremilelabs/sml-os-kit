"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import constructFirestoreQuery, { FirestoreQueryParams } from "../utilties/constructFirestoreQuery"

export default async function queryCollection(
  collectionPath: string,
  queryParams: FirestoreQueryParams
): Promise<any[]> {
  const { appFirestore } = new _FirebaseAdmin()
  const collection = appFirestore.collection(collectionPath)
  const query = constructFirestoreQuery(collection, queryParams)
  const queryResult = await query.get()
  const queryDocs = queryResult.docs
  return queryDocs.map((doc) => doc.data())
}
