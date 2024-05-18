import _runSafeServerAction from "@/~sml-os-kit/common/functions/_runSafeServerAction"
import _fetchRoadmapItems from "@/~sml-os-kit/modules/roadmap/functions/_fetchRoadmapItems"
import { RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import { useQuery } from "@tanstack/react-query"

export default function useRoadmapItemsQuery({ type }: { type: RoadmapItemType }) {
  return useQuery({
    queryKey: ["roadmap", type],
    queryFn: async () => {
      const response = await _runSafeServerAction(_fetchRoadmapItems, { type })
      if (response.type === "error") throw response.result
      return response.result
    },
    retry: () => false,
  })
}
