export type StatusGroup = "Open" | "Active" | "Closed"

export interface RoadmapTicket {
  id: string
  url: string
  title: string
  description?: string
  createdTime: Date
  urgent: boolean
  status: string
  statusGroup: StatusGroup
  creatorEmail?: string | null
  closedDate?: string
}

export interface RoadmapPatch {
  id: string
  url: string
  title: string
  description?: string
  createdTime: Date
  urgent: boolean
  status: string
  statusGroup: StatusGroup
  tickets: string[]
  size?: string
}

export interface RoadmapFeature {
  id: string
  url: string
  title: string
  description?: string
  createdTime: Date
  status: string
  statusGroup: StatusGroup
  tickets: string[]
  size?: string
}
