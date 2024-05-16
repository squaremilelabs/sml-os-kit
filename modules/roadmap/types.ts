export type RoadmapItemType = "ticket" | "patch" | "feature"
export type RoadmapStatusGroupName = "Open" | "Active" | "Closed"
export interface RoadmapItem {
  id: string
  type: RoadmapItemType
  title: string
  description?: string
  submitter?: string | null | (string | null)[]
  urgent: boolean
  status: {
    name?: string
    color?: string
    group?: RoadmapStatusGroupName
  } | null
}
