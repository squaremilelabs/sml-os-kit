"use client"
import AppLogotype from "@/~sml-os-kit/common/components/AppLogotype"
import { getOSUserHomePagePath } from "@/~sml-os-kit/modules/auth/functions/getOSUserHomePagePath"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import { Spinner } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const auth = useAuthState()

  useEffect(() => {
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
    <div className="h-screen w-full flex flex-row items-center justify-center space-x-2">
      <AppLogotype size="lg" />
      <Spinner />
    </div>
  )
}
