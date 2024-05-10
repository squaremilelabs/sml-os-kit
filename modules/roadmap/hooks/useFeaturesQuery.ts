import { useQuery } from "@tanstack/react-query"
import fetchFeatures from "../functions/_fetchFeatures"

export default function useFeaturesQuery() {
  return useQuery({
    queryKey: ["roadmap", "features"],
    queryFn: async () => {
      const features = await fetchFeatures()
      return features
    },
  })
}
