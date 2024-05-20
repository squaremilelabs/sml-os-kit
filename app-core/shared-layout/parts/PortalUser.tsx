import _clearSessionCookie from "@/~sml-os-kit/auth/functions/_clearSessionCookie"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import usePortal from "@/~sml-os-kit/modules/portal-utils/usePortal"
import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import { Button } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"

export default function PortalUser() {
  const auth = useAuthState()
  const { portalUser, setPortalUser } = usePortal()

  const isCurrentUser = auth.user?.id === portalUser?.id

  const queryClient = useQueryClient()
  const handleButtonPress = async () => {
    if (isCurrentUser) {
      await signOut()
      await _clearSessionCookie()
      await queryClient.invalidateQueries({ queryKey: ["auth"] })
    } else {
      setPortalUser(null)
    }
  }

  return (
    <div className="border-y border-default-200 p-4">
      {portalUser?.displayName ? (
        <p className="text-md font-medium">{portalUser?.displayName}</p>
      ) : null}
      <p className="text-sm">{portalUser?.email ?? "No user"}</p>
      <Button
        size="sm"
        className="h-fit min-w-0 bg-transparent p-0 text-default-500 data-[hover]:bg-transparent data-[hover]:underline"
        variant="light"
        disableRipple
        onPress={handleButtonPress}
      >
        {isCurrentUser ? "Logout" : "Change User"}
      </Button>
    </div>
  )
}
