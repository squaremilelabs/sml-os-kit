"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import constructFirestoreQuery, {
  FirestoreQueryParams,
} from "@/~sml-os-kit/~sml-firebase/firestore/utilties/constructFirestoreQuery"
import { filesFirestoreCollectionPath } from "../constants"
import { StorageFile } from "../types"

export default async function _queryFiles<ExtStorageFile extends StorageFile>(
  queryParams: FirestoreQueryParams
): Promise<StorageFile[]> {
  const { sysFirestore } = new _FirebaseAdmin()
  const collection = sysFirestore.collection(filesFirestoreCollectionPath)
  const query = constructFirestoreQuery(collection, queryParams)
  const queryResult = await query.get()
  const queryDocs = queryResult.docs
  return queryDocs.map((doc) => doc.data() as ExtStorageFile)
}
