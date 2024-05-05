"use client"

import FirebaseClient from "@/~sml-os-kit/~sml-firebase/firebase/FirebaseClient"
import { StorageFile } from "../types"
import createFileDoc from "../utilities/_createFileDoc"
import _getNonExpiringDownloadUrl from "./_getPublicDownloadUrl"

export default async function uploadFile<ExtStorageFile extends StorageFile>(
  file: File,
  input: Omit<ExtStorageFile, "id" | "name" | "contentType" | "createdAt" | "publicUrl">
): Promise<ExtStorageFile> {
  const { storage } = new FirebaseClient()
  const { id, uploadResult } = await storage.uploadBytes(file.name, file)

  let publicUrl: string | undefined = undefined
  if (input.isPublic) {
    publicUrl = await _getNonExpiringDownloadUrl(id)
  }

  const fileDocData = {
    id,
    name: uploadResult.metadata.name,
    contentType: uploadResult.metadata.contentType,
    createdAt: Date.now(),
    publicUrl,
    ...input,
  } as ExtStorageFile

  const fileData = await createFileDoc<ExtStorageFile>(fileDocData)
  return fileData
}
