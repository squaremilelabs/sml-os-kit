import useRoadmapItemsQuery from "@/~sml-os-kit/modules/roadmap/hooks/useRoadmapItemsQuery"
import {
  RoadmapItem,
  RoadmapItemType,
  RoadmapStatusGroupName,
} from "@/~sml-os-kit/modules/roadmap/types"
import { Card, ScrollShadow } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { useEffect, useLayoutEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

const itemGroups: { group: RoadmapStatusGroupName; color: string }[] = [
  { group: "Open", color: "zinc" },
  { group: "Active", color: "blue" },
  { group: "Closed", color: "green" },
]

export default function RoadmapItems({ type }: { type: RoadmapItemType }) {
  const itemsQuery = useRoadmapItemsQuery({ type })
  const { theme } = useTheme()

  const [displayedItems, setDisplayedItems] = useState<RoadmapItem[]>([])
  useLayoutEffect(() => {
    if (itemsQuery.data) {
      setDisplayedItems(itemsQuery.data)
    }
  }, [itemsQuery.data])

  return (
    <div className="flex h-full w-full overflow-auto p-4 space-x-4 rounded-xl border border-default-200">
      {itemGroups.map(({ group, color }) => {
        const groupItems = displayedItems.filter((item) => item.status?.group === group)
        return (
          <div
            key={group}
            className={twMerge("flex flex-col h-full rounded-lg space-y-4", "grow", "min-w-80")}
          >
            <div
              className={twMerge(
                `sticky top-0 p-2 font-medium rounded-lg`,
                theme === "light" ? `bg-${color}-100` : `bg-${color}-800`
              )}
            >
              {group}
            </div>
            <div className="space-y-4 h-full">
              {groupItems.map((item) => {
                return (
                  <Card key={item.id} className="min-h-24">
                    <p>{item.title}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
