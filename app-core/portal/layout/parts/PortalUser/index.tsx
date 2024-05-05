import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import _clearSessionCookie from "@/~sml-os-kit/modules/auth/functions/_clearSessionCookie"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import usePortalAgent from "@/~sml-os-kit/modules/portal-agent/usePortalAgent"
import { mdiChevronDown } from "@mdi/js"
import Icon from "@mdi/react"
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function PortalUser() {
  const { isAdminAgent, portalUser, clearPortalUser } = usePortalAgent()

  const [popoverOpen, setPopoverOpen] = useState(false)

  const queryClient = useQueryClient()
  const handleLogout = async () => {
    await signOut()
    await _clearSessionCookie()
    await queryClient.invalidateQueries({ queryKey: ["auth"] })
  }

  if (!portalUser) return null

  return (
    <>
      <Popover
        placement="bottom-end"
        isOpen={popoverOpen}
        onOpenChange={(open) => setPopoverOpen(open)}
        isDismissable
      >
        <PopoverTrigger>
          <Button
            className={"justify-between p-2 space-2 h-fit"}
            variant="flat"
            size="sm"
            startContent={
              portalUser ? (
                <Avatar
                  src={portalUser?.photoUrl}
                  name={portalUser?.displayName}
                  className="w-6 h-6 text-xs"
                  showFallback
                  getInitials={(name) => name[0]}
                />
              ) : null
            }
            endContent={<Icon path={mdiChevronDown} className="w-4" />}
            disableRipple
          >
            <span className="text-xs text-left grow truncate">
              {portalUser ? portalUser?.email : "-"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-52 flex flex-col space-y-2 items-stretch bg-content2">
          {isAdminAgent ? (
            <>
              <Button size="sm" variant="light" onClick={clearPortalUser}>
                {portalUser ? "Change" : "Select"} User
              </Button>
            </>
          ) : (
            <Button size="sm" variant="light" onPress={handleLogout}>
              Logout
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}
