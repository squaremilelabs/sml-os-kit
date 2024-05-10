import _createUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_createUser"
import {
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react"
import { useFormik } from "formik"
import { BaseOSUser } from "../../types"
import _updateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_updateUser"
import useOSUserQuery from "../../hooks/useOSUserQuery"
import useAuthState from "../../hooks/useAuthState"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import _reactivateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_reactivateUser"
import _deactivateUser from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_deactivateUser"
import uploadFile from "@/~sml-os-kit/~sml-firebase/storage/functions/uploadFile"
import UserAvatar from "../UserAvatar"
import FileUploadButton from "@/~sml-os-kit/common/components/FileUploadButton"
import Icon from "@mdi/react"
import { mdiAlertCircleOutline } from "@mdi/js"
import { Key, useLayoutEffect, useState } from "react"
import roles from "@/$sml-os-config/roles"
import * as Yup from "yup"

type CreateUserInput = Parameters<typeof _createUser<BaseOSUser>>[0]
type UpdateUserInput = Parameters<typeof _updateUser<BaseOSUser>>[1]

type UserModalMode = "update" | "create" | "updateSelf" | "viewOnly"

export default function UserModal({
  isOpen,
  onClose,
  mode,
  userId,
  enforcedRoleId,
}: {
  isOpen: boolean
  onClose: () => void
  mode: UserModalMode
  userId?: string
  enforcedRoleId?: string
}) {
  const auth = useAuthState()
  const userQuery = useOSUserQuery(mode === "updateSelf" ? auth.user?.id : userId, {
    throwIfNotFound: true,
  })
  const user = userQuery.data

  // Check out the formik tutorial: https://formik.org/docs/tutorial
  const formik = useFormik<CreateUserInput | UpdateUserInput>({
    /* 
      Instead of setting up a useState + useEffect for the form fields,
      we can pass the data directly to `initialValues`, and set
      `enableReinitialize` to `true` which handles this for us.
    */
    initialValues: {
      displayName: user?.displayName ?? "",
      email: user?.email ?? "",
      photoUrl: user?.photoUrl ?? undefined,
      roleId: user?.roleId ?? enforcedRoleId ?? undefined,
    },
    enableReinitialize: true,
    /* 
      Use `validationSchema` + `yup` for basic validations.
      Can also use `validate` which takes a handler, for more complex business-logic validations
      https://formik.org/docs/tutorial#validation
    */
    validationSchema: Yup.object({
      displayName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      photoUrl: Yup.string().optional(),
      roleId: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      saveMutation.mutate(values)
    },
  })

  /* 
    Tanstack Mutations make it so that we don't need to set up
    states for loading, errors, etc.
  */

  // In this component we use a pattern of invalidating queries
  // after each mutation, which can be expensive for other use cases.
  const queryClient = useQueryClient()

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const uploadedFile = await uploadFile(file, { isPublic: true })
      formik.setFieldValue("photoUrl", uploadedFile.publicUrl)
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (input: CreateUserInput | UpdateUserInput) => {
      if (mode === "create") {
        await _createUser<BaseOSUser>(input as CreateUserInput)
        await queryClient.invalidateQueries({ queryKey: ["users"] })
        handleCloseAndReset()
      }
      if (mode === "update" || mode === "updateSelf") {
        if (!user) {
          throw new Error("No user to update")
        } else {
          await _updateUser<BaseOSUser>(user.id, input as UpdateUserInput)
          await queryClient.invalidateQueries({ queryKey: ["users"] })
          if (mode === "updateSelf") {
            await queryClient.invalidateQueries({ queryKey: ["auth"] })
          }
          handleCloseAndReset()
        }
      }
    },
  })

  const changeStatusMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No user to update")
      if (user.isDeactivated) {
        await _reactivateUser(user.id)
        await queryClient.invalidateQueries({ queryKey: ["users"] })
      } else {
        await _deactivateUser(user.id)
        await queryClient.invalidateQueries({ queryKey: ["users"] })
      }
    },
  })

  // ROLES LOGIC
  /* 
    Use-case for when there are elements that control the UI state 
    of the form, but is not part of the actual form data (so shouldn't
    be comingled with formik - and React state + effects are acceptable)
  */
  const [roleSelectionType, setRoleSelectionType] = useState<"admin" | "portal">("admin")

  // Reminder that useLayoutEffect is like useEffect, but only runs
  // after the component is painted. This helps avoid UI flashing.
  useLayoutEffect(() => {
    if (user) {
      setRoleSelectionType(user.role?.userType as typeof roleSelectionType)
    } else if (enforcedRoleId) {
      const role = roles.find((role) => role.id === enforcedRoleId)
      setRoleSelectionType(role?.userType as typeof roleSelectionType)
    }
  }, [user, enforcedRoleId])

  const adminRoles = roles.filter((role) => role.userType === "admin")
  const portalRoles = roles.filter((role) => role.userType === "portal")
  const selectableRoles = roleSelectionType === "admin" ? adminRoles : portalRoles

  // Various helpers for UI
  const isNameDisabled = mode === "viewOnly"
  const isEmailDisabled = mode === "viewOnly" || mode === "updateSelf"
  const isRoleSelectionDisabled =
    mode === "viewOnly" || mode === "updateSelf" || enforcedRoleId || user?.isSML

  const isSaveEnabled = (mode === "create" && formik.isValid) || (formik.dirty && formik.isValid)

  const modalTitle =
    mode === "updateSelf"
      ? "Update Profile"
      : mode === "create"
        ? "New User"
        : mode === "update"
          ? "Update User"
          : "User"

  const handleCloseAndReset = () => {
    formik.handleReset(null)
    uploadPhotoMutation.reset()
    changeStatusMutation.reset()
    saveMutation.reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseAndReset}
      isDismissable={false}
      scrollBehavior="outside"
      placement="top-center"
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            {userQuery.isLoading ? (
              <ModalBody className="p-12 grid place-content-center">
                <Spinner />
              </ModalBody>
            ) : userQuery.isError ? (
              <ModalBody className="p-12 grid place-content-center">
                <Icon path={mdiAlertCircleOutline} className="w-16 h-16" />
              </ModalBody>
            ) : (
              <form onSubmit={isSaveEnabled ? formik.handleSubmit : undefined}>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalBody>
                  {mode === "create" && !enforcedRoleId ? (
                    <>
                      <div className="flex flex-row space-x-2 items-center">
                        <Checkbox
                          isSelected={roleSelectionType === "admin"}
                          onClick={() => {
                            formik.setFieldValue("roleId", null)
                            setRoleSelectionType("admin")
                          }}
                          className="data-[selected]:font-semibold"
                        >
                          Admin User
                        </Checkbox>
                        <Checkbox
                          isSelected={roleSelectionType === "portal"}
                          onClick={() => {
                            formik.setFieldValue("roleId", null)
                            setRoleSelectionType("portal")
                          }}
                          className="data-[selected]:font-semibold"
                        >
                          Portal User
                        </Checkbox>
                      </div>
                      <Divider />
                    </>
                  ) : null}
                  <div className="flex flex-row items-center space-x-2">
                    <UserAvatar user={formik.values} size="lg" disableTooltip />
                    {mode !== "viewOnly" ? (
                      <ButtonGroup size="sm" variant="flat">
                        <FileUploadButton
                          onFileUpload={uploadPhotoMutation.mutate}
                          isLoading={uploadPhotoMutation.isPending}
                          accept="image/png,image/jpg,image/jpeg"
                        >
                          {formik.values.photoUrl ? "Change Photo" : "Upload Photo"}
                        </FileUploadButton>
                        {formik.values.photoUrl ? (
                          <Button
                            onPress={() => {
                              formik.setFieldValue("photoUrl", null)
                              formik.setFieldTouched("photoUrl")
                            }}
                          >
                            Remove Photo
                          </Button>
                        ) : null}
                      </ButtonGroup>
                    ) : null}
                  </div>
                  <Input
                    label="Display Name"
                    id="displayName"
                    name="displayName"
                    value={formik.values.displayName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.displayName && !!formik.touched.displayName} //only show as invalid if touched
                    errorMessage={
                      formik.touched.displayName ? formik.errors.displayName : undefined
                    }
                    isReadOnly={isNameDisabled}
                    classNames={{
                      input: isNameDisabled ? "cursor-not-allowed" : undefined,
                    }}
                  />
                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.email && !!formik.touched.email} //only show as invalid if touched
                    errorMessage={formik.touched.email ? formik.errors.email : undefined}
                    isReadOnly={isEmailDisabled}
                    classNames={{
                      input: isEmailDisabled ? "cursor-not-allowed" : undefined,
                    }}
                  />
                  <Select
                    label={roleSelectionType === "admin" ? "Admin Role" : "Portal Role"}
                    id="roleId"
                    name="roleId"
                    selectionMode="single"
                    selectedKeys={[(formik.values.roleId as Key) ?? ""]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.roleId && !!formik.touched.roleId}
                    errorMessage={formik.touched.roleId ? formik.errors.roleId : undefined}
                    selectorIcon={isRoleSelectionDisabled ? <div /> : undefined}
                    classNames={{
                      trigger: isRoleSelectionDisabled ? "cursor-not-allowed" : undefined,
                    }}
                    isOpen={isRoleSelectionDisabled ? false : undefined} // used to disable the selection without the isDisabled faded style
                    description={
                      mode === "updateSelf"
                        ? `For security purposes, your login email & role can only be updated from the "Manage Users" page by an Admin.`
                        : undefined
                    }
                  >
                    {selectableRoles.map((role) => {
                      return (
                        <SelectItem key={role.id} value={role.id}>
                          {role.label}
                        </SelectItem>
                      )
                    })}
                  </Select>
                </ModalBody>
                <ModalFooter className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center">
                    {user && mode !== "updateSelf" ? (
                      <div className="flex space-x-1">
                        <Chip
                          color={user.isDeactivated ? "danger" : "success"}
                          variant="flat"
                          size="lg"
                        >
                          {user.isDeactivated ? "Deactivated" : "Active"}
                        </Chip>
                        {mode !== "viewOnly" ? (
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => changeStatusMutation.mutate()}
                            isLoading={changeStatusMutation.isPending}
                          >
                            {user.isDeactivated ? "Reactivate" : "Deactivate"}
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <div />
                    )}
                    {mode !== "viewOnly" ? (
                      <Button
                        color="primary"
                        type="submit"
                        isLoading={saveMutation.isPending}
                        isDisabled={!isSaveEnabled}
                      >
                        Save
                      </Button>
                    ) : null}
                  </div>
                  {saveMutation.isError ? (
                    <span className="text-danger text-sm text-right">
                      {saveMutation.error.message}
                    </span>
                  ) : null}
                </ModalFooter>
              </form>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
