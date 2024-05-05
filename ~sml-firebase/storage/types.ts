export interface StorageFile {
  id: string
  name: string
  contentType?: string
  createdAt: number
  isPublic: boolean
  publicUrl?: string
}
