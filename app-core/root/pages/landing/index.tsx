"use client"

import { getOSUserHomePagePath } from "@/~sml-os-kit/auth/functions/getOSUserHomePagePath"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import BrandLogotype from "@/~sml-os-kit/common/components/BrandLogotype"
import { Spinner } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { useLayoutEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const auth = useAuthState()

  useLayoutEffect(() => {
    if (auth.state === "hasUser") {
      if (auth.user) {
        const homePage = getOSUserHomePagePath(auth.user)
        router.push(homePage)
      }
    }
    if (auth.state === "error" || auth.state === "noUser") {
      router.push("/login")
    }
  }, [auth, router])

  return (
    <div className="flex h-screen w-full flex-row items-center justify-center space-x-2">
      <BrandLogotype size="lg" />
      <Spinner />
    </div>
  )
}
