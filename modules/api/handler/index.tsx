import { NextRequest } from "next/server"
import { OSUser } from "../../auth/types"
import { APIErrorResponseJson, APIErrorStatusCode, APISuccessStatusCode } from "../types"
import {
  getAgentName,
  getCookieName,
  getSiteConfig,
  getTokenName,
} from "@/~sml-os-kit/config/functions"
import _constructNextAPIResponse from "../functions/_constructNextAPIResonse"
import _getOSUserFromAccessToken from "../../auth/functions/_getOSUserFromAccessToken"
import _getOSUserFromSessionCookie from "../../auth/functions/_getOSUserFromSessionCookie"
import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"
import _getOSUser from "../../auth/functions/_getOSUser"
import prisma from "@/prisma/client"

// provided to API handler
interface HandlerParams {
  request: NextRequest
  skipLog?: boolean
  disableAuthError?: boolean
}

// provided to API routes
interface CallbackParams {
  user: OSUser | null | undefined
  agentUser?: OSUser | null | undefined
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

export default async function apiRouteHandler<ExpectedSuccessJson>(
  { request, skipLog, disableAuthError }: HandlerParams,
  callback: (
    params: CallbackParams
  ) => Promise<CallbackSuccessResponse<ExpectedSuccessJson> | CallbackErrorResponse>
) {
  try {
    const url = request.nextUrl
    const siteConfig = getSiteConfig()

    /* authentication */
    const accessToken = request.headers.get(getTokenName())
    const sessionCookie = request.cookies.get(getCookieName())

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
        return _constructNextAPIResponse<"error">(401, {
          type: "system",
          message: "Missing or invalid access token or session cookie",
        })
      }

      // portal user attempting to hit the wrong endpoint
      const { role } = userResponse.user
      if (role?.userType === "portal") {
        const portalConfig = siteConfig.portals?.find((portal) => portal.id === role?.portalId)
        const invalidPortal = portalConfig && !url.pathname.startsWith(portalConfig.basePath)
        if (!portalConfig || invalidPortal) {
          return _constructNextAPIResponse<"error">(403, {
            type: "system",
            message: "Not authorized",
          })
        }
      }
    }

    // get callback auth params
    const agentUid = request.headers.get(getAgentName())
    let user: OSUser | null | undefined
    let agentUser: OSUser | null | undefined
    const authMethod = sessionCookie ? "sessionCookie" : accessToken ? "accessToken" : "system"

    if (agentUid) {
      const isAdmin = userResponse.user?.role?.userType === "admin"
      const isSameUser = userResponse.user?.id === agentUid
      if (isAdmin || isSameUser) {
        if (isSameUser) {
          user = userResponse.user
        } else {
          user = await _getOSUser(agentUid)
        }
        agentUser = userResponse.user
      } else {
        return _constructNextAPIResponse(400, {
          type: "system",
          message: "Only admins may be agents",
        })
      }
    } else {
      user = userResponse.user
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
      user,
      agentUser,
      authMethod,
      payload,
      searchParams,
    })

    // TODO: Handle logging
    if (!skipLog) {
      const logData = {
        userId: agentUser?.id ?? user?.id ?? "system",
        userEmail: agentUser?.email ?? user?.email ?? "system",
        method: request.method,
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
