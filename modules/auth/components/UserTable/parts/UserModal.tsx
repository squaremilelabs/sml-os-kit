import _createUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_createUser"
import {
  Avatar,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spacer,
  useDisclosure,
} from "@nextui-org/react"
import { Key, useEffect, useLayoutEffect, useState } from "react"
import { BaseOSUser } from "../../../types"
import FileUploadButton from "@/~sml-os-kit/common/components/FileUploadButton"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import uploadFile from "@/~sml-os-kit/~sml-firebase/storage/functions/uploadFile"
import _getOSUser from "../../../functions/_getOSUser"
import _updateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_updateUser"
import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import roles from "@/$sml-os-config/roles"
import _deactivateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_deactivateUser"
import _reactivateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_reactivateUser"

const emptyUserData: Partial<BaseOSUser> = {
  displayName: undefined,
  email: undefined,
  roleId: undefined,
  photoUrl: undefined,
}

export default function UserModal({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean
  onClose: () => void
  userId: string | null
}) {
  const [data, setData] = useState(emptyUserData)

  const userQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      if (!userId) return null
      return _getOSUser(userId)
    },
  })
  const user = userQuery.data

  useLayoutEffect(() => {
    if (user) {
      setData({
        displayName: user.displayName,
        email: user.email,
        roleId: user.roleId,
        photoUrl: user.photoUrl,
      })
    } else {
      setData(emptyUserData)
    }
  }, [user])

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const uploadedFile = await uploadFile(file, { isPublic: true })
      setData((prev) => ({ ...prev, photoUrl: uploadedFile.publicUrl }))
    },
  })

  const queryClient = useQueryClient()
  const saveMutation = useMutation({
    mutationKey: ["users", userId],
    mutationFn: async () => {
      if (userId) {
        await _updateUser<BaseOSUser>(userId, {
          displayName: data.displayName,
          email: data.email,
          roleId: data.roleId,
          photoUrl: data.photoUrl,
        })
      } else {
        if (data.displayName && data.email && data.roleId) {
          await _createUser<BaseOSUser>({
            displayName: data.displayName,
            email: data.email,
            roleId: data.roleId,
            photoUrl: data.photoUrl,
          })
        } else {
          throw new Error("Missing fields")
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["users"] })
      onClose()
    },
  })

  const statusMutation = useMutation({
    mutationKey: ["users", userId],
    mutationFn: async () => {
      if (userId) {
        if (user?.isDeactivated) {
          await _reactivateUser(userId)
        } else {
          await _deactivateUser(userId)
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const hasMissingValues = !data.displayName || !data.email || !data.roleId
  const hasChanges =
    data.displayName !== user?.displayName ||
    data.email !== user?.email ||
    data.roleId !== user?.roleId

  const isSaveDisabled = !!hasMissingValues || (!!user && !hasChanges)

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top-center" scrollBehavior="outside">
      <ModalContent className={userQuery.isLoading ? `blur-sm` : undefined}>
        {() => (
          <>
            <ModalHeader>{user ? "Update User" : "New User"}</ModalHeader>
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
                  isLoading={uploadImageMutation.isPending}
                  onFileUpload={uploadImageMutation.mutate}
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
                color={user && user.displayName !== data.displayName ? "primary" : "default"}
              />
              <Input
                label="Email"
                value={data.email}
                onValueChange={(val) => setData((prev) => ({ ...prev, email: val }))}
                color={user && user.email !== data.email ? "primary" : "default"}
              />
              <Select
                label="Role"
                selectedKeys={[data.roleId as Key]}
                selectionMode="single"
                onSelectionChange={(selection) => {
                  const [roleId] = Array.from(selection)
                  setData((prev) => ({ ...prev, roleId: roleId as string }))
                }}
                disallowEmptySelection
                color={user && user.roleId !== data.roleId ? "primary" : "default"}
              >
                {roles?.map((role) => {
                  return (
                    <SelectItem key={role.id} value={role.id}>
                      {role.label}
                    </SelectItem>
                  )
                })}
              </Select>
            </ModalBody>
            <ModalFooter className="flex flex-row items-center justify-between">
              {user ? (
                <div className="flex flex-row space-x-1 items-center">
                  <Chip variant="flat" color={user.isDeactivated ? "danger" : "success"} size="lg">
                    {user.isDeactivated ? "Deactivated" : "Active"}
                  </Chip>
                  <Button
                    variant="light"
                    size="sm"
                    onPress={() => statusMutation.mutate()}
                    isLoading={statusMutation.isPending}
                  >
                    {user?.isDeactivated ? "Reactivate" : "Deactivate"}
                  </Button>
                </div>
              ) : (
                <Spacer />
              )}
              <div className="flex flex-row items-center space-x-1">
                {saveMutation.isError ? (
                  <span className="text-danger text-sm">Failed to save</span>
                ) : null}
                <Button
                  color="primary"
                  isDisabled={isSaveDisabled}
                  onPress={() => saveMutation.mutate()}
                  isLoading={saveMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
