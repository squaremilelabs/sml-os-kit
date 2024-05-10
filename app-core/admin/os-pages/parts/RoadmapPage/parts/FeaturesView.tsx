import RoadmapKanban from "@/~sml-os-kit/modules/roadmap/components/RoadmapKanban"
import useFeaturesQuery from "@/~sml-os-kit/modules/roadmap/hooks/useFeaturesQuery"

export default function FeaturesView() {
  const { data: features } = useFeaturesQuery()

  return (
    <div className="grid grid-rows-[auto,1fr] space-y-8">
      <div>
        <h1 className="font-semibold text-2xl">Features</h1>
        <p> New features</p>
      </div>
      <RoadmapKanban items={features} />
    </div>
  )
}
