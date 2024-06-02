import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import { OSUser } from "@/~sml-os-kit/auth/types"
import _runSafeServerAction from "@/~sml-os-kit/common/functions/_runSafeServerAction"
import internalAPI from "@/~sml-os-kit/modules/api/functions/internalAPI"
import { APIMethod, EndpointConfig } from "@/~sml-os-kit/modules/api/types"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"
import { usePathname } from "next/navigation"
import { useCallback, useLayoutEffect } from "react"
import { useSessionStorage } from "usehooks-ts"

export default function usePortal() {
  const auth = useAuthState()
  const pathname = usePathname()
  const portal = getPortalConfigFromPathname(pathname)
  const [portalUser, setPortalUser] = useSessionStorage<OSUser | null>(
    `portal:${portal?.id}:user`,
    null
  )

  // Set portalUser if logged in user is actually the user - set to null, if not a valid portal
  useLayoutEffect(() => {
    if (portal) {
      if (auth.user?.role?.type === "portal") {
        if (auth.user.role.portalId === portal.id) {
          setPortalUser(auth.user)
        } else {
          setPortalUser(null)
        }
      }
    }
  }, [auth, portal, setPortalUser])

  const portalAPI = useCallback(
    async <M extends APIMethod, E extends EndpointConfig>(
      input: Parameters<typeof internalAPI<M, E>>[0]
    ) => {
      return internalAPI<M, E>({ ...input, asUserId: portalUser?.id })
    },
    [portalUser]
  )

  return {
    portal,
    portalUser,
    setPortalUser,
    portalAPI,
  }
}
