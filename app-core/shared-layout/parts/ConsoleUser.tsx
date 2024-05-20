import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"
import _clearSessionCookie from "@/~sml-os-kit/auth/functions/_clearSessionCookie"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import UserModal from "@/~sml-os-kit/auth/components/UserModal"

export default function ConsoleUser() {
  const { user } = useAuthState()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const queryClient = useQueryClient()

  // Modal
  const modalProps = useDisclosure()
  const handleOpenModal = () => {
    setPopoverOpen(false)
    modalProps.onOpen()
  }

  // Logout
  const handleLogout = async () => {
    await signOut()
    await _clearSessionCookie()
    await queryClient.invalidateQueries({ queryKey: ["auth"] })
  }

  return (
    <>
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
                src={user?.photoUrl}
                name={user?.displayName}
                className="h-6 w-6 text-xs"
                showFallback
                getInitials={(name) => name[0]}
              />
            }
            endContent={<Icon path={mdiChevronDown} className="w-4" />}
          >
            <span className="grow truncate text-left text-xs">{user?.email}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-52 flex-col items-stretch space-y-2 bg-content2 p-2">
          <Button
            onPress={handleOpenModal}
            radius="sm"
            size="sm"
            isDisabled={user?.roleId === "demo"}
          >
            Update Profile
          </Button>
          <Button
            radius="sm"
            size="sm"
            variant="flat"
            onPress={handleLogout}
            isDisabled={user?.roleId === "demo"}
          >
            Logout
          </Button>
        </PopoverContent>
      </Popover>
      <UserModal mode="updateSelf" isOpen={modalProps.isOpen} onClose={modalProps.onClose} />
    </>
  )
}
