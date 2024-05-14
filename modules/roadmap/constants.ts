import { RoadmapItemType, RoadmapStatusGroupName } from "@/~sml-os-kit/modules/roadmap/types"
import { mdiFlashOutline, mdiRoomServiceOutline, mdiWrenchOutline } from "@mdi/js"

export const roadmapStatusGroupNameMap: Map<string, RoadmapStatusGroupName> = new Map([
  ["To-do", "Open"],
  ["In progress", "Active"],
  ["Complete", "Closed"],
])

export const roadmapTypeInfoMap: Map<RoadmapItemType, { title: string; iconPath: string }> =
  new Map([
    ["ticket", { title: "Tickets", iconPath: mdiRoomServiceOutline }],
    ["patch", { title: "Patches", iconPath: mdiWrenchOutline }],
    ["feature", { title: "Features", iconPath: mdiFlashOutline }],
  ])
