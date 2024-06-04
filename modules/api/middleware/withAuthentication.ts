import { PipeFunction } from "./types"
import { authCookieName, authTokenHeaderName } from "@/~sml-os-kit/config/auth/constants"
import _getOSUserFromAccessToken from "@/~sml-os-kit/auth/functions/_getOSUserFromAccessToken"
import _getOSUserFromSessionCookie from "@/~sml-os-kit/auth/functions/_getOSUserFromSessionCookie"
import { OSUser } from "@/~sml-os-kit/auth/types"
import APIError from "@/~sml-os-kit/modules/api/error"

export interface AuthenticationContext {
  authUser: OSUser | null
  authMethod: "accessToken" | "sessionCookie" | null
}

export const withAuthentication: PipeFunction<AuthenticationContext> = async (
  req,
  context,
  next
) => {
  const accessToken = req.headers.get(authTokenHeaderName)
  const sessionCookie = req.cookies.get(authCookieName)

  if (!accessToken && !sessionCookie)
    throw new APIError("Authentication: No access token or session cookie provided.", {
      status: 401,
      source: "os",
    })

  if (accessToken) {
    try {
      const authUser = await _getOSUserFromAccessToken(accessToken)
      context.authUser = authUser
      context.authMethod = "accessToken"
      return await next()
    } catch (error: Error & any) {
      throw new APIError("Authentication: Failed to get user from access token.", {
        status: 401,
        source: "os",
        cause: error,
      })
    }
  }

  if (sessionCookie) {
    try {
      const authUser = await _getOSUserFromSessionCookie(sessionCookie.value)
      context.authUser = authUser
      context.authMethod = "sessionCookie"
      return await next()
    } catch (error: Error & any) {
      throw new APIError("Authentication: Failed to get user from session cookie.", {
        status: 401,
        source: "os",
        cause: error,
      })
    }
  }
}
