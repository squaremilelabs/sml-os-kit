import { useQuery } from "@tanstack/react-query"
import _getOSUser from "../functions/_getOSUser"

export default function useOSUserQuery(
  userId?: string | null | undefined,
  options?: { throwIfNotFound?: boolean }
) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      if (!userId) return null
      const user = await _getOSUser(userId)
      if (!user && options?.throwIfNotFound) {
        throw new Error("User not found")
      }
      return user
    },
  })
}
