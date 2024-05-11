import { useQuery } from "@tanstack/react-query"
import _fetchPatches from "../functions/_fetchPatches"

export default function usePatchesQuery() {
  return useQuery({
    queryKey: ["patches"],
    queryFn: async () => {
      const patches = await _fetchPatches()
      return patches
    },
  })
}
