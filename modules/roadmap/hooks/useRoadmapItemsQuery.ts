import _fetchRoadmapItems from "@/~sml-os-kit/modules/roadmap/functions/_fetchRoadmapItems"
import { RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import { useQuery } from "@tanstack/react-query"

export default function useRoadmapItemsQuery({ type }: { type: RoadmapItemType }) {
  return useQuery({
    queryKey: ["roadmap", type],
    queryFn: async () => {
      return _fetchRoadmapItems({ type })
    },
    retry: (failureCount) => failureCount <= 2,
  })
}
