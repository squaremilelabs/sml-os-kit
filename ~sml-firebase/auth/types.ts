export interface User {
  id: string
  displayName: string
  email: string
  isDeactivated: boolean
  createdAt: number
  hasSignedIn: boolean
  photoUrl?: string
}

export interface UserAccessToken {
  id: string
  userId: string
  accessToken: string
  createdAt: number
}
