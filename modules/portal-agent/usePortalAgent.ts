import useAuthState from "../auth/hooks/useAuthState"
import { useLocalStorage } from "usehooks-ts"
import { useCallback, useLayoutEffect } from "react"
import internalAPI from "../api/functions/internalAPI"
import { APIMethod, EndpointConfig } from "../api/types"
import { OSUser } from "../auth/types"
import _getOSUser from "../auth/functions/_getOSUser"
import _queryUsers from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_queryUsers"
import { usePathname } from "next/navigation"
import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import roles from "@/$sml-os-config/roles"
import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"

export default function usePortalAgent(options?: { initializeListeners?: boolean }) {
  const router = usePageRouter()
  const pathname = usePathname()
  const siteConfig = getSiteConfig()
  const portal = siteConfig.portals?.find((portal) => pathname.startsWith(portal.basePath))
  const auth = useAuthState()
  const [portalUser, setPortalUser] = useLocalStorage<OSUser | null>(
    `portalUser:${portal?.id}`,
    null
  )

  useLayoutEffect(() => {
    if (options?.initializeListeners) {
      if (portalUser) {
        if (auth.state === "noUser" || auth.state === "error") {
          setPortalUser(null)
        }
        if (portalUser?.role?.portalId !== portal?.id) {
          setPortalUser(null)
        }
      } else if (!portalUser) {
        if (auth.state === "hasUser" && auth.user) {
          if (auth.user.role?.portalId === portal?.id) {
            setPortalUser(auth.user)
          }
        }
      }
    }
  }, [portal, portalUser, auth, setPortalUser, options?.initializeListeners])

  const setPortalUserByEmail = useCallback(
    async (email: string) => {
      const portalRole = roles.find((role) => role.portalId === portal?.id)
      const usersResult = await _queryUsers<OSUser>({
        where: [
          ["email", "==", email],
          ["roleId", "==", portalRole?.id],
          ["isDeactivated", "!=", true],
        ],
      })
      const baseUser = usersResult[0]
      if (!baseUser) throw new Error("Not a valid user for this portal")
      const user = await _getOSUser(baseUser.id)
      setPortalUser(user)
    },
    [portal, setPortalUser]
  )

  useLayoutEffect(() => {
    if (options?.initializeListeners) {
      const asEmailParam = router.query?.asEmail
      if (asEmailParam) {
        if (portalUser?.email !== asEmailParam) {
          if (auth?.user?.role?.userType === "admin") {
            setPortalUserByEmail(asEmailParam)
              .catch(() => setPortalUser(null))
              .finally(() => {
                router.push(null, { asEmail: null }, { merge: true })
              })
          }
        }
      }
    }
  }, [router, portalUser, auth, setPortalUserByEmail, setPortalUser, options?.initializeListeners])

  const clearPortalUser = () => {
    setPortalUser(null)
  }

  const portalAPI = async <M extends APIMethod, E extends EndpointConfig = never>(
    input: Parameters<typeof internalAPI<M, E>>[0]
  ) => {
    return internalAPI<M, E>({ ...input, asUserId: portalUser?.id })
  }

  const isAdminAgent = portalUser?.id !== auth.user?.id && auth?.user?.role?.userType === "admin"

  return {
    portalConfig: portal,
    isAdminAgent,
    portalUser,
    clearPortalUser,
    setPortalUserByEmail,
    portalAPI,
  }
}
