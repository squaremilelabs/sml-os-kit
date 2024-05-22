import { NextRequest } from "next/server"
import { OSUser } from "../../../auth/types"
import { APIErrorResponseJson, APIErrorStatusCode, APISuccessStatusCode } from "../types"
import _constructNextAPIResponse from "./_constructNextAPIResonse"
import _getOSUserFromAccessToken from "../../../auth/functions/_getOSUserFromAccessToken"
import _getOSUserFromSessionCookie from "../../../auth/functions/_getOSUserFromSessionCookie"
import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"
import _getOSUser from "../../../auth/functions/_getOSUser"
import prisma from "@/lib/prisma/client"
import {
  authActorHeaderName,
  authCookieName,
  authTokenHeaderName,
} from "@/~sml-os-kit/config/auth/constants"
import siteConfig from "@/$sml-os-config/site"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"

// provided to API handler
interface HandlerParams {
  request: NextRequest
  skipLog?: boolean
  disableAuthError?: boolean
}

// provided to API routes
interface CallbackParams {
  actorUser: OSUser | null | undefined
  authUser: OSUser | null | undefined
  authMethod: "accessToken" | "sessionCookie" | "system"
  payload?: any
  searchParams?: any
}

// returned from API routes
interface CallbackSuccessResponse<T> {
  type: "success"
  status: APISuccessStatusCode
  json: T & object
}

interface CallbackErrorResponse {
  type: "error"
  status: APIErrorStatusCode
  json: APIErrorResponseJson
}

function isSuccessResponse<T>(
  response: CallbackSuccessResponse<T> | CallbackErrorResponse
): response is CallbackSuccessResponse<T> {
  return response.type === "success"
}

export default async function _apiRouteHandler<ExpectedSuccessJson>(
  { request, skipLog, disableAuthError }: HandlerParams,
  callback: (
    params: CallbackParams
  ) => Promise<CallbackSuccessResponse<ExpectedSuccessJson> | CallbackErrorResponse>
) {
  try {
    const url = request.nextUrl

    /* authentication */
    const accessToken = request.headers.get(authTokenHeaderName)
    const sessionCookie = request.cookies.get(authCookieName)

    let userResponse: { user?: OSUser | null; error?: Error } = {}
    if (accessToken) {
      userResponse = await _getOSUserFromAccessToken(accessToken)
        .then((user) => ({ user }))
        .catch((error) => ({ error }))
    } else if (sessionCookie) {
      userResponse = await _getOSUserFromSessionCookie(sessionCookie.value)
        .then((user) => ({ user }))
        .catch((error) => ({ error }))
    }

    // throw auth errors if disableAuthError !== true
    if (!disableAuthError) {
      // Code or server error occurred in `getOSUserFromX` (should be rare)
      if (userResponse.error) {
        const message = [
          `Failed to get user from access token or session cookie.`,
          userResponse.error?.message,
        ]
          .filter(Boolean)
          .join("\n")
        return _constructNextAPIResponse<"error">(500, { type: "system", message })
      }

      if (!userResponse.user) {
        return _constructNextAPIResponse<"error">(400, {
          type: "system",
          message: "Missing or invalid access token or session cookie",
        })
      }

      // portal user attempting to hit the wrong endpoint
      const { role } = userResponse.user
      if (role?.type === "portal") {
        const userPortal = siteConfig.portals?.get(role.portalId)
        const currentPortal = getPortalConfigFromPathname(url.pathname)
        const invalidPortal = !userPortal || userPortal.id !== currentPortal?.id
        if (invalidPortal) {
          return _constructNextAPIResponse<"error">(403, {
            type: "system",
            message: "Not authorized",
          })
        }
      }
    }

    // get callback auth params
    const authUser = userResponse.user
    let actorUser = userResponse.user
    const actorUid = request.headers.get(authActorHeaderName)
    const authMethod = sessionCookie ? "sessionCookie" : accessToken ? "accessToken" : "system"

    if (authUser) {
      // override actor user
      if (actorUid && actorUid !== authUser.id) {
        if (authUser.role?.type === "console") {
          const portal = getPortalConfigFromPathname(url.pathname)
          const hasAccess =
            authUser.role.isAdmin ||
            authUser.role.accessiblePortalIds?.includes(portal?.id ?? "NOT_A_PORTAL")
          if (hasAccess) {
            actorUser = await _getOSUser(actorUid)
          }
        }
      }
    }

    // get callback request params
    const payload = await request
      .json()
      .then((json) => json)
      .catch(() => ({}))

    const searchParams: { [key: string]: string } = {}
    request.nextUrl.searchParams.forEach((value, key) => {
      searchParams[key] = value
    })

    const callbackResponse = await callback({
      actorUser,
      authUser,
      authMethod,
      payload,
      searchParams,
    })

    if (!skipLog) {
      const logData = {
        userId: authUser?.id ?? "system",
        userEmail: authUser?.email ?? "system",
        // method: request.method,
        endpoint: url.pathname,
        status: callbackResponse.status,
        statusType: callbackResponse.type,
        request: JSON.stringify(payload),
        response: JSON.stringify(callbackResponse.json),
      }
      await prisma.apiLog.create({ data: logData })
    }

    if (isSuccessResponse<ExpectedSuccessJson>(callbackResponse)) {
      const { status, json } = callbackResponse
      return _constructNextAPIResponse<"success">(status, json)
    } else {
      const { status, json } = callbackResponse
      return _constructNextAPIResponse<"error">(status, json)
    }
  } catch (error: Error & any) {
    return _constructNextAPIResponse(500, {
      type: "system",
      message: error?.message,
      fullError: jsonifyError(error),
    })
  }
}
