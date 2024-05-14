import { RoadmapItemType, RoadmapStatusGroupName } from "@/~sml-os-kit/modules/roadmap/types"

export const roadmapStatusGroupNameMap: Map<string, RoadmapStatusGroupName> = new Map([
  ["To-do", "Open"],
  ["In progress", "Active"],
  ["Complete", "Closed"],
])

export const roadmapTypeInfoMap: Map<RoadmapItemType, { title: string; description: string }> =
  new Map([
    ["ticket", { title: "Ticket Triage", description: "" }],
    ["patch", { title: "Quick Patches", description: "" }],
    ["feature", { title: "Feature Roadmap", description: "" }],
  ])
