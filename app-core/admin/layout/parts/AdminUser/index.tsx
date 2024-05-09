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
import _clearSessionCookie from "@/~sml-os-kit/modules/auth/functions/_clearSessionCookie"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import UserModal from "@/~sml-os-kit/modules/auth/components/UserModal"

export default function AdminUser() {
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
        onOpenChange={(open) => setPopoverOpen(open)}
        isDismissable
      >
        <PopoverTrigger>
          <Button
            className={"justify-between p-2 space-2 h-fit"}
            radius="sm"
            variant="flat"
            size="sm"
            startContent={
              <Avatar
                src={user?.photoUrl}
                name={user?.displayName}
                className="w-6 h-6 text-xs"
                showFallback
                getInitials={(name) => name[0]}
              />
            }
            endContent={<Icon path={mdiChevronDown} className="w-4" />}
          >
            <span className="text-xs text-left grow truncate">{user?.email}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-52 flex flex-col space-y-2 items-stretch bg-content2">
          <Button onPress={handleOpenModal} radius="sm" size="sm">
            Update Profile
          </Button>
          <Button radius="sm" size="sm" variant="flat" onPress={handleLogout}>
            Logout
          </Button>
        </PopoverContent>
      </Popover>
      <UserModal mode="updateSelf" isOpen={modalProps.isOpen} onClose={modalProps.onClose} />
    </>
  )
}
