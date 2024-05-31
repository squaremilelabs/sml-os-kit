import { RoadmapItemType, RoadmapStatusGroupName } from "@/~sml-os-kit/modules/roadmap/types"
import { mdiLightbulbOn, mdiTag, mdiWrench } from "@mdi/js"

export const roadmapStatusGroupNameMap: Map<string, RoadmapStatusGroupName> = new Map([
  ["To-do", "Open"],
  ["In progress", "Active"],
  ["Complete", "Closed"],
])

export const roadmapTypeInfoMap: Map<RoadmapItemType, { title: string; iconPath: string }> =
  new Map([
    ["feature", { title: "Features", iconPath: mdiLightbulbOn }],
    ["ticket", { title: "Tickets", iconPath: mdiTag }],
    ["patch", { title: "Patches", iconPath: mdiWrench }],
  ])
