"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import constructFirestoreQuery, {
  FirestoreQueryParams,
} from "@/~sml-os-kit/~sml-firebase/firestore/utilties/constructFirestoreQuery"
import { usersFirestoreCollectionPath } from "../constants"
import { User } from "../types"

export default async function _queryUsers<ExtUser extends User>(
  queryParams: FirestoreQueryParams
): Promise<ExtUser[]> {
  const { sysFirestore } = new _FirebaseAdmin()
  const collection = sysFirestore.collection(usersFirestoreCollectionPath)
  const query = constructFirestoreQuery(collection, queryParams)
  const queryResult = await query.get()
  const queryDocs = queryResult.docs
  return queryDocs.map((doc) => doc.data() as ExtUser)
}
