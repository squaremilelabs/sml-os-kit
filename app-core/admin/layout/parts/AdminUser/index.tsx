import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"
import _clearSessionCookie from "@/~sml-os-kit/modules/auth/functions/_clearSessionCookie"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChangeEvent, useEffect, useState } from "react"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import _updateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_updateUser"
import { BaseOSUser } from "@/~sml-os-kit/modules/auth/types"
import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import uploadFile from "@/~sml-os-kit/~sml-firebase/storage/functions/uploadFile"
import FileUploadButton from "@/~sml-os-kit/common/components/FileUploadButton"

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
            disableRipple
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
      <AdminUserModal {...modalProps} />
    </>
  )
}

function AdminUserModal({ isOpen, onOpenChange }: ReturnType<typeof useDisclosure>) {
  const [data, setData] = useState<{
    displayName: string | undefined
    email: string | undefined
    photoUrl?: string | undefined
  }>({ displayName: "", email: "", photoUrl: "" })

  const { user } = useAuthState()
  useEffect(() => {
    if (user) {
      setData({
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoUrl,
      })
    }
  }, [user])

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return uploadFile(file, { isPublic: true })
    },
  })

  const handleFileUpload = async (file: File) => {
    const uploadedFile = await uploadMutation.mutateAsync(file)
    setData((prev) => ({ ...prev, photoUrl: uploadedFile.publicUrl }))
  }

  const hasChanges = data.displayName !== user?.displayName || data.photoUrl !== user?.photoUrl
  const isDisabled = !hasChanges || !data.displayName

  const saveMutation = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string
      data: { displayName?: string; email?: string }
    }) => _updateUser<BaseOSUser>(userId, data),
  })

  const queryClient = useQueryClient()
  const handleSubmit = async () => {
    if (user) {
      await saveMutation.mutateAsync({ userId: user.id, data })
      await queryClient.invalidateQueries({ queryKey: ["auth", "users"] })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="top-center"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Update Profile</ModalHeader>
            <ModalBody>
              <div className="flex flex-row space-x-2 items-center">
                <Avatar
                  src={data?.photoUrl}
                  name={data.displayName}
                  size="lg"
                  showFallback
                  getInitials={(name) => name[0]}
                />
                <FileUploadButton
                  size="sm"
                  variant="flat"
                  isLoading={uploadMutation.isPending}
                  onFileUpload={handleFileUpload}
                  accept="image/*"
                >
                  {data?.photoUrl ? "Change Photo" : "Upload Photo"}
                </FileUploadButton>
                {data.photoUrl ? (
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => setData((prev) => ({ ...prev, photoUrl: undefined }))}
                  >
                    Remove Photo
                  </Button>
                ) : null}
              </div>
              <Input
                label="Display Name"
                value={data.displayName}
                onValueChange={(val) => setData((prev) => ({ ...prev, displayName: val }))}
                isRequired
              />
              <Input
                label="Email"
                value={data.email}
                isReadOnly
                description="Please ask an admin to update your email address"
              />
            </ModalBody>
            <ModalFooter className="flex flex-row items-center justify-between">
              {saveMutation.isError ? (
                <span className="text-danger text-sm">Failed to save</span>
              ) : (
                <div />
              )}
              <Button
                color="primary"
                isDisabled={isDisabled}
                onPress={handleSubmit}
                isLoading={saveMutation.isPending}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

function FileInput() {
  return (
    <label>
      <input type="file" className="hidden" />
    </label>
  )
}
