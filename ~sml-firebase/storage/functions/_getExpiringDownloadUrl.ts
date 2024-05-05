"use server"

import _FirebaseAdmin from "@/~sml-os-kit/~sml-firebase/firebase/_FirebaseAdmin"

export default async function _getExpiringDownloadUrl(
  fileId: string,
  options?: { expiresInMinutes?: number }
) {
  const { storage } = new _FirebaseAdmin()
  const [files] = await storage.bucket.getFiles({ prefix: fileId + "/" })
  if (!files.length) throw new Error("File does not exist")
  const file = files[0]
  const expiresInMinutes = options?.expiresInMinutes ?? 5 // default to 5 minutes
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + expiresInMinutes * 60 * 100,
  })
  return url
}
