"use client"
import Applogotype from "@/~sml-os-kit/common/components/AppLogotype"
import LoginForm from "@/~sml-os-kit/modules/auth/components/LoginForm"
import { getOSUserHomePagePath } from "@/~sml-os-kit/modules/auth/functions/getOSUserHomePagePath"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import { useRouter } from "next/navigation"
import { useLayoutEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuthState()

  useLayoutEffect(() => {
    if (auth.state === "hasUser") {
      if (auth.user) {
        const homePage = getOSUserHomePagePath(auth.user)
        router.push(homePage)
      }
    }
  }, [auth, router])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center space-y-4 p-8">
      <Applogotype size="lg" />
      <LoginForm />
    </div>
  )
}
