export interface User {
  id: string
  displayName: string
  email: string
  isDeactivated: boolean
  createdAt: number
  photoUrl?: string
}

export interface UserAccessToken {
  id: string
  userId: string
  accessToken: string
  createdAt: number
}
