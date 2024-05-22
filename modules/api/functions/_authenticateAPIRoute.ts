import _getOSUserFromAccessToken from "@/~sml-os-kit/auth/functions/_getOSUserFromAccessToken"
import _getOSUserFromSessionCookie from "@/~sml-os-kit/auth/functions/_getOSUserFromSessionCookie"
import { OSUser } from "@/~sml-os-kit/auth/types"
import { authCookieName, authTokenHeaderName } from "@/~sml-os-kit/config/auth/constants"
import { NextRequest } from "next/server"

interface APIAuthenticationSuccessResponse {
  success: true
  authUser: OSUser | null
  authMethod: "accessToken" | "sessionCookie"
}

interface APIAuthenticationErrorResponse {
  success: false
  authUser: null
  authMethod: null
  errorMessage: string
}

type APIAuthenticationResponse = APIAuthenticationSuccessResponse | APIAuthenticationErrorResponse

export default async function _authenticateAPIRoute(
  request: NextRequest
): Promise<APIAuthenticationResponse> {
  const accessToken = request.headers.get(authTokenHeaderName)
  const sessionCookie = request.cookies.get(authCookieName)

  if (accessToken) {
    try {
      const authUser = await _getOSUserFromAccessToken(accessToken)
      return { authUser, authMethod: "accessToken", success: true }
    } catch (error: Error & any) {
      return {
        success: false,
        authUser: null,
        authMethod: null,
        errorMessage: "Authentication: Failed to get user from access token. \n" + error?.message,
      }
    }
  }
  if (sessionCookie) {
    try {
      const authUser = await _getOSUserFromSessionCookie(sessionCookie.value)
      return { authUser, authMethod: "sessionCookie", success: true }
    } catch (error: Error & any) {
      return {
        success: false,
        authUser: null,
        authMethod: null,
        errorMessage: "Authentication: Failed to get user from session cookie. \n" + error?.message,
      }
    }
  }
  return {
    authUser: null,
    authMethod: null,
    success: false,
    errorMessage: "Authentication: No access token or session cookie provided.",
  }
}
