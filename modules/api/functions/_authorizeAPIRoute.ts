import { NextRequest } from "next/server"
import { authActorHeaderName } from "@/~sml-os-kit/config/auth/constants"
import { OSUser } from "@/~sml-os-kit/auth/types"
import siteConfig from "@/$sml-os-config/site"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"
import _getOSUser from "@/~sml-os-kit/auth/functions/_getOSUser"

interface APIAuthorizationParams {
  request: NextRequest
  authUser: OSUser | null
}

interface APIAuthorizationSuccessResponse {
  success: true
  actorUser: OSUser | null
}

interface APIAuthorizationErrorResponse {
  success: false
  actorUser: null
  errorMessage: string
}

export default async function _authorizeAPIRoute({
  request,
  authUser,
}: APIAuthorizationParams): Promise<
  APIAuthorizationSuccessResponse | APIAuthorizationErrorResponse
> {
  if (!authUser) return { success: false, errorMessage: "Not authenticated.", actorUser: null }
  const url = request.nextUrl
  const currentPortal = getPortalConfigFromPathname(url.pathname)

  // Portal User: check if user is authorized to access the current portal
  if (authUser?.role?.type === "portal") {
    const userPortal = siteConfig.portals?.get(authUser?.role.portalId)
    const invalidPortal = !userPortal || userPortal.id !== currentPortal?.id
    if (invalidPortal) {
      return {
        success: false,
        errorMessage: "Not authorized",
        actorUser: null,
      }
    }
  }

  // Console user: supply actorUser if actorUid is provided
  const actorUid = request.headers.get(authActorHeaderName)
  const hasActorUid = authUser && actorUid && authUser.id !== actorUid
  const hasPortalAccess =
    authUser &&
    authUser.role &&
    authUser.role.type === "console" &&
    authUser.role.accessiblePortalIds?.includes(currentPortal?.id ?? "NOT_A_PORTAL")
  if (hasActorUid && hasPortalAccess) {
    const actorUser = await _getOSUser(actorUid)
    return { success: true, actorUser }
  }

  // Default: actorUser is authUser
  return { success: true, actorUser: authUser }
}
