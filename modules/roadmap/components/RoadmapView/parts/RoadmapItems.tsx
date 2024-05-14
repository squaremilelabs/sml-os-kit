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
  { group: "Open", color: "yellow" },
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
    <div className="flex h-full w-full overflow-auto rounded-xl border border-default-200">
      {itemGroups.map(({ group, color }) => {
        const groupItems = displayedItems.filter((item) => item.status?.group === group)
        return (
          <ScrollShadow
            key={group}
            className={twMerge(
              "flex flex-col h-full rounded-lg space-y-4 p-4",
              "grow",
              "min-w-80",
              "overflow-auto"
            )}
          >
            <div
              className={twMerge(
                `sticky top-0 p-2 font-medium rounded-lg`,
                theme === "light" ? `bg-${color}-100` : `bg-${color}-800`,
                "z-20"
              )}
            >
              {group}
            </div>
            {groupItems.map((item) => {
              return (
                <Card key={item.id} className="min-h-24 z-10">
                  <p>{item.title}</p>
                </Card>
              )
            })}
          </ScrollShadow>
        )
      })}
    </div>
  )
}
