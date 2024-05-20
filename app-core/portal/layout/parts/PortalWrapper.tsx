"use client"

import _queryOSUsers from "@/~sml-os-kit/auth/functions/_queryOSUsers"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import BrandLogotype from "@/~sml-os-kit/common/components/BrandLogotype"
import _runSafeServerAction from "@/~sml-os-kit/common/functions/_runSafeServerAction"
import usePortal from "@/~sml-os-kit/modules/portal-utils/usePortal"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import { useMutation } from "@tanstack/react-query"
import React, { useState } from "react"

export default function PortalWrapper({ children }: { children: React.ReactNode }) {
  const auth = useAuthState()
  const [email, setEmail] = useState("")
  const { portal, portalUser, setPortalUser } = usePortal()

  const modalIsOpen = auth.user?.role?.type === "console" && !portalUser

  const submitMutation = useMutation({
    mutationKey: ["portalWrapper", email],
    mutationFn: async () => {
      if (auth?.user?.roleId === "demo") {
        setPortalUser({ ...auth.user, email })
        return
      }
      const response = await _runSafeServerAction(_queryOSUsers, {
        where: [["email", "==", email]],
      })
      if (response.type === "error") throw response.result
      const [selectedUser] = response.result
      if (!selectedUser) throw new Error("User not found")
      if (selectedUser.role?.type !== "portal") throw new Error(`Not a ${portal?.title} user`)
      if (selectedUser.role.portalId !== portal?.id) throw new Error(`Not a ${portal?.title} user`)
      setPortalUser(selectedUser)
    },
  })

  return (
    <>
      {children}
      <Modal
        isOpen={modalIsOpen}
        backdrop="blur"
        classNames={{ closeButton: "hidden" }}
        placement="top-center"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitMutation.mutate()
          }}
        >
          <ModalContent>
            <ModalHeader>
              <BrandLogotype title={portal?.title} />
            </ModalHeader>
            <ModalBody>
              <Input
                type="email"
                label="Email"
                description={`Enter the email of a ${portal?.title} User to use the app as them.`}
                isInvalid={submitMutation.isError}
                errorMessage={submitMutation.isError ? submitMutation.error.message : undefined}
                value={email}
                onValueChange={setEmail}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                isLoading={submitMutation.isPending}
                isDisabled={!email}
              >
                Sign-in
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
