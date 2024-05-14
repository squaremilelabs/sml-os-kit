"use client"

import RoadmapItems from "@/~sml-os-kit/modules/roadmap/components/RoadmapView/parts/RoadmapItems"
import { roadmapTypeInfoMap } from "@/~sml-os-kit/modules/roadmap/constants"
import { RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { Button, Tab, Tabs } from "@nextui-org/react"
import { useState } from "react"

export default function RoadmapView({
  selectedType,
  onSelectType,
}: {
  selectedType: RoadmapItemType
  onSelectType: (selection: RoadmapItemType) => any
}) {
  return (
    <div className="grid grid-rows-[auto_auto_1fr] h-full w-full p-4 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Roadmap</h1>
        <Button color="primary" startContent={<Icon path={mdiPlus} className="w-6" />}>
          New Ticket
        </Button>
      </div>
      <Tabs
        size="lg"
        radius="sm"
        classNames={{
          tabList: "w-full border border-default-200",
        }}
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
