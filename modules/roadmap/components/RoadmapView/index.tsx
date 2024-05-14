"use client"

import RoadmapItems from "@/~sml-os-kit/modules/roadmap/components/RoadmapView/parts/RoadmapItems"
import { roadmapTypeInfoMap } from "@/~sml-os-kit/modules/roadmap/constants"
import { RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import { Tab, Tabs } from "@nextui-org/react"

export default function RoadmapView({
  selectedType,
  onSelectType,
}: {
  selectedType: RoadmapItemType
  onSelectType: (selection: RoadmapItemType) => any
}) {
  return (
    <div className="grid grid-rows-[auto_auto_1fr] h-full p-4">
      <h1>Roadmap</h1>
      <Tabs
        variant="underlined"
        selectedKey={selectedType}
        onSelectionChange={(key) => onSelectType(key as RoadmapItemType)}
      >
        {Array.from(roadmapTypeInfoMap.entries()).map(([type, info]) => {
          return <Tab key={type} title={info.title} />
        })}
      </Tabs>
      <RoadmapItems type={selectedType} />
    </div>
  )
}
