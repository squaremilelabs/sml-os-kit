"use client"
import { useRouter } from "next/navigation"
import React from "react"
import useAuthState from "../hooks/useAuthState"
import { Button, Spinner } from "@nextui-org/react"
import validateOSUserPageAccess from "../functions/validateOSUserPageAccess"
import { getOSUserHomePagePath } from "../functions/getOSUserHomePagePath"
import Icon from "@mdi/react"
import { mdiCloseCircleOutline, mdiLockOutline } from "@mdi/js"
import useDynamicPathname from "@/~sml-os-kit/common/hooks/useDynamicPathname"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = useDynamicPathname()
  const router = useRouter()
  const auth = useAuthState()

  if (auth.state === "error") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-2">
        <Icon path={mdiCloseCircleOutline} className="w-12 text-default-500" />
        <h1 className="text-2xl font-medium">Authentication Error</h1>
        <span>Please refresh the page</span>
      </div>
    )
  }

  if (auth.state === "noUser") {
    router.replace("/login")
  }

  // hasUser
  if (auth.state === "hasUser" && auth.user) {
    const userHomePage = getOSUserHomePagePath(auth.user)
    const hasAccess = validateOSUserPageAccess(auth.user, pathname)

    if (!hasAccess) {
      // no access - display no access to user
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-2">
          <Icon path={mdiLockOutline} className="w-12 text-default-500" />
          <h1 className="text-2xl font-medium">No access</h1>
          <Button variant="flat" onPress={() => router.push(userHomePage)}>
            Back to App
          </Button>
        </div>
      )
    } else {
      // has access - display the page
      return <React.Fragment>{children}</React.Fragment>
    }
  }

  // LOADING
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Spinner />
    </div>
  )
}
