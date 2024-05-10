import { useQuery } from "@tanstack/react-query"
import fetchPatches from "../functions/_fetchPatches"

export default function usePatchesQuery() {
  return useQuery({
    queryKey: ["roadmap", "patches"],
    queryFn: async () => {
      const patches = await fetchPatches()
      return patches
    },
  })
}
