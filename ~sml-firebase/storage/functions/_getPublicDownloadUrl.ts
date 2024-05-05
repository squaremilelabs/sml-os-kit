"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"

export default async function _getPublicDownloadUrl(fileId: string) {
  const { storage } = new _FirebaseAdmin()
  const [files] = await storage.bucket.getFiles({ prefix: fileId + "/" })
  if (!files.length) throw new Error("File does not exist")
  const file = files[0]
  return storage.getDownloadUrl(file.name)
}
