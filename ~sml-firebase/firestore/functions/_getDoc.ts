"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"

export default async function getDoc(collectionPath: string, docId: string): Promise<any> {
  const { appFirestore } = new _FirebaseAdmin()
  const collection = appFirestore.collection(collectionPath)
  const doc = await collection.doc(docId).get()
  return doc.data()
}
