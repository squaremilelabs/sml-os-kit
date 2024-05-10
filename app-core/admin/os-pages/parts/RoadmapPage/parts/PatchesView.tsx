import RoadmapKanban from "@/~sml-os-kit/modules/roadmap/components/RoadmapKanban"
import usePatchesQuery from "@/~sml-os-kit/modules/roadmap/hooks/usePatchesQuery"

export default function PatchesView() {
  const { data: patches } = usePatchesQuery()

  return (
    <div className="w-full grid grid-rows-[auto,1fr] space-y-8">
      <div>
        <h1 className="font-semibold text-2xl">Patches</h1>
        <p> Fixes and updates to existing features</p>
      </div>
      <RoadmapKanban items={patches} />
    </div>
  )
}
