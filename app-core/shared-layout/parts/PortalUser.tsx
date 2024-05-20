import _clearSessionCookie from "@/~sml-os-kit/auth/functions/_clearSessionCookie"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import usePortal from "@/~sml-os-kit/modules/portal-utils/usePortal"
import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import { mdiChevronDown } from "@mdi/js"
import Icon from "@mdi/react"
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger, popover } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function PortalUser() {
  const auth = useAuthState()
  const { portalUser, setPortalUser } = usePortal()

  const isCurrentUser = auth.user?.id === portalUser?.id && auth.user?.role?.type === "portal"

  const [popoverOpen, setPopoverOpen] = useState(false)

  const queryClient = useQueryClient()
  const handleButtonPress = async () => {
    if (isCurrentUser) {
      await signOut()
      await _clearSessionCookie()
      setPopoverOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["auth"] })
    } else {
      setPortalUser(null)
      setPopoverOpen(false)
    }
  }

  return (
    <Popover
      radius="sm"
      placement="top-start"
      isOpen={popoverOpen}
      onOpenChange={setPopoverOpen}
      isDismissable
    >
      <PopoverTrigger>
        <Button
          className={"space-2 h-fit justify-between p-2"}
          radius="sm"
          variant="flat"
          size="sm"
          startContent={
            <Avatar
              src={portalUser?.photoUrl}
              name={portalUser?.displayName}
              className="h-6 w-6 text-xs"
              showFallback
              getInitials={(name) => name[0]}
            />
          }
          endContent={<Icon path={mdiChevronDown} className="w-4" />}
        >
          <span className="grow truncate text-left text-xs">
            {portalUser?.displayName ?? portalUser?.email}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-52 flex-col items-stretch space-y-2 bg-content2 p-2">
        <Button radius="sm" size="sm" variant="flat" onPress={handleButtonPress}>
          {isCurrentUser ? "Logout" : "Change User"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
