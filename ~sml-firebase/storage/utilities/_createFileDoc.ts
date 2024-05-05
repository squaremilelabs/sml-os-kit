"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"
import { StorageFile } from "../types"
import { filesFirestoreCollectionPath } from "../constants"

export default async function _createFileDoc<ExtStorageFile extends StorageFile>(
  input: ExtStorageFile
): Promise<ExtStorageFile> {
  const { sysFirestore } = new _FirebaseAdmin()
  const fileRef = sysFirestore.collection(filesFirestoreCollectionPath).doc(input.id)
  await fileRef.create(input)
  const fileDoc = await fileRef.get()
  return fileDoc.data() as ExtStorageFile
}
