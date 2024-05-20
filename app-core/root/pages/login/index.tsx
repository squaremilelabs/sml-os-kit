"use client"

import LoginForm from "@/~sml-os-kit/auth/components/LoginForm"
import { getOSUserHomePagePath } from "@/~sml-os-kit/auth/functions/getOSUserHomePagePath"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import BrandLogotype from "@/~sml-os-kit/common/components/BrandLogotype"
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
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 p-8">
      <BrandLogotype size="lg" />
      <LoginForm />
    </div>
  )
}
