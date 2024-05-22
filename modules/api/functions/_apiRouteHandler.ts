import { NextRequest } from "next/server"
import { OSUser } from "../../../auth/types"
import { APIErrorResponseJson, APIErrorStatusCode, APISuccessStatusCode } from "../types"
import _constructNextAPIResponse from "./_constructNextAPIResonse"
import _getOSUserFromAccessToken from "../../../auth/functions/_getOSUserFromAccessToken"
import _getOSUserFromSessionCookie from "../../../auth/functions/_getOSUserFromSessionCookie"
import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"
import _getOSUser from "../../../auth/functions/_getOSUser"
import {
  authActorHeaderName,
  authCookieName,
  authTokenHeaderName,
} from "@/~sml-os-kit/config/auth/constants"
import siteConfig from "@/$sml-os-config/site"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"
import prisma from "@/~sml-os-kit/db/prisma"
import _authenticateAPIRoute from "@/~sml-os-kit/modules/api/functions/_authenticateAPIRoute"
import _authorizeAPIRoute from "@/~sml-os-kit/modules/api/functions/_authorizeAPIRoute"

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
  authMethod: "accessToken" | "sessionCookie" | null
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

    // authenticate and authorize
    const authentication = await _authenticateAPIRoute(request)
    const authorization = await _authorizeAPIRoute({
      request,
      authUser: authentication.authUser,
    })

    // throw auth errors if disableAuthError !== true
    if (!disableAuthError) {
      if (!authentication.success) {
        return _constructNextAPIResponse<"error">(401, {
          source: "os",
          message: authentication.errorMessage,
        })
      }

      if (!authorization.success) {
        return _constructNextAPIResponse<"error">(403, {
          source: "os",
          message: authorization.errorMessage,
        })
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
      actorUser: authorization.actorUser,
      authUser: authentication.authUser,
      authMethod: authentication.authMethod,
      payload,
      searchParams,
    })

    if (!skipLog) {
      const logData = {
        userId: authentication.authUser?.id ?? "system",
        userEmail: authentication.authUser?.email ?? "system",
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
