"use client"
import getIdTokenFromSignInLink from "@/~sml-os-kit/~sml-firebase/auth/auth-functions/getIdTokenFromSignInLink"
import _setSessionCookieFromIdToken from "@/~sml-os-kit/auth/functions/_setSessionCookieFromIdToken"
import { getOSUserHomePagePath } from "@/~sml-os-kit/auth/functions/getOSUserHomePagePath"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import { Spinner } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useLayoutEffect } from "react"

export default function HandleLoginPage() {
  const router = useRouter()
  const auth = useAuthState()
  const queryClient = useQueryClient()

  useLayoutEffect(() => {
    if (auth.state === "hasUser") {
      if (auth.user) {
        const homePage = getOSUserHomePagePath(auth.user)
        router.push(homePage)
      }
    }
  }, [auth, router])

  // Hanlde sign-in link
  const windowDep = typeof window
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      getIdTokenFromSignInLink(window.location.href)
        .then((idToken) => {
          if (!idToken) throw new Error("Could not login")
          return _setSessionCookieFromIdToken(idToken)
        })
        .then(() => {
          return queryClient.invalidateQueries({ queryKey: ["auth"] })
        })
        .catch((error) => {
          console.error(error)
          queryClient.invalidateQueries({ queryKey: ["auth"] })
        })
    }
  }, [windowDep, queryClient])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Spinner />
    </div>
  )
}
