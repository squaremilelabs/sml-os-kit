"use client"

import { useQuery } from "@tanstack/react-query"
import _getSessionOSUser from "../functions/_getSessionOSUser"
import { OSUser } from "../types"

export default function useAuthState(): {
  state: "loading" | "error" | "noUser" | "hasUser"
  error?: string | null
  user?: OSUser | null
} {
  const sessionUserQuery = useQuery({
    queryKey: ["auth", "users"],
    queryFn: async () => {
      const user = await _getSessionOSUser()
      return user
    },
  })
  return {
    state: sessionUserQuery.isLoading
      ? "loading"
      : sessionUserQuery.isError
        ? "error"
        : !sessionUserQuery.data
          ? "noUser"
          : "hasUser",
    error: sessionUserQuery.error?.message,
    user: sessionUserQuery.data,
  }
}
