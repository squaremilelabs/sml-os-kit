import signOut from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/signOut"
import _clearSessionCookie from "@/~sml-os-kit/modules/auth/functions/_clearSessionCookie"
import usePortalAgent from "@/~sml-os-kit/modules/portal-agent/usePortalAgent"
import { Button, Card, CardBody } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function PortalUser() {
  const { isAdminAgent, portalUser, clearPortalUser } = usePortalAgent()

  const queryClient = useQueryClient()
  const handleLogout = async () => {
    await signOut()
    await _clearSessionCookie()
    await queryClient.invalidateQueries({ queryKey: ["auth"] })
  }

  if (!portalUser) return null

  return (
    <>
      <Card className="rounded-lg bg-content2">
        <CardBody>
          <p className="text-lg font-medium px-1 truncate">{portalUser?.displayName}</p>
          <p className="text-default-500 px-1 truncate">{portalUser?.email}</p>
          <Button
            size="sm"
            variant="light"
            className="px-1 py-1 h-fit w-fit min-w-0"
            onPress={() => {
              if (isAdminAgent) {
                clearPortalUser()
              } else {
                handleLogout()
              }
            }}
          >
            {isAdminAgent ? "Change User" : "Logout"}
          </Button>
        </CardBody>
      </Card>
    </>
  )
}
