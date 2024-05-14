"use client"
import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"
import RoadmapView from "@/~sml-os-kit/modules/roadmap/components/RoadmapView"
import { RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import { useSearchParams } from "next/navigation"

export default function RoadmapPage() {
  const searchParams = useSearchParams()
  const router = usePageRouter()

  return (
    <RoadmapView
      selectedType={searchParams.get("type") as RoadmapItemType}
      onSelectType={(selection) => router.push(null, { type: selection })}
    />
  )
}
