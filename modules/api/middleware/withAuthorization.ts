import siteConfig from "@/$sml-os-config/site"
import _getOSUser from "@/~sml-os-kit/auth/functions/_getOSUser"
import { OSUser } from "@/~sml-os-kit/auth/types"
import { authActorHeaderName } from "@/~sml-os-kit/config/auth/constants"
import APIError from "@/~sml-os-kit/modules/api/error"
import { PipeFunction } from "@/~sml-os-kit/modules/api/middleware/types"
import { AuthenticationContext } from "@/~sml-os-kit/modules/api/middleware/withAuthentication"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"

export interface AuthorizationContext {
  actorUser: OSUser | null
}

export const withAuthorization: PipeFunction<AuthenticationContext & AuthorizationContext> = async (
  req,
  context,
  next
) => {
  if (!context?.authUser)
    throw new APIError("Authorization: User is not authenticated.", { status: 403, source: "os" })

  const authUser = context.authUser
  const url = req.nextUrl
  const currentPortal = getPortalConfigFromPathname(url.pathname)

  // Portal User: check if user is authorized to access the current portal
  if (authUser?.role?.type === "portal") {
    const userPortal = siteConfig.portals?.get(authUser?.role.portalId)
    const invalidPortal = !userPortal || userPortal.id !== currentPortal?.id
    if (invalidPortal)
      throw new APIError("Authorization: Portal user does not have access to this route.", {
        status: 403,
        source: "os",
      })
  }

  // Console user: supply actorUser if actorUid is provided
  const actorUid = req.headers.get(authActorHeaderName)
  const hasActorUid = authUser && actorUid && authUser.id !== actorUid
  const hasPortalAccess =
    authUser &&
    authUser.role &&
    authUser.role.type === "console" &&
    authUser.role.accessiblePortalIds?.includes(currentPortal?.id ?? "NOT_A_PORTAL")
  if (hasActorUid && hasPortalAccess) {
    const actorUser = await _getOSUser(actorUid)
    context.actorUser = actorUser
    return await next()
  }

  // Default: actorUser is authUser
  context.actorUser = authUser
  return await next()
}
