import useRoadmapItemsQuery from "@/~sml-os-kit/modules/roadmap/hooks/useRoadmapItemsQuery"
import {
  RoadmapItem,
  RoadmapItemType,
  RoadmapStatusGroupName,
} from "@/~sml-os-kit/modules/roadmap/types"
import { Card, CardBody, Chip, ScrollShadow, Skeleton } from "@nextui-org/react"
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

  // Setting this up now to prepare for adding client-side filters
  const [displayedItems, setDisplayedItems] = useState<RoadmapItem[]>([])
  useLayoutEffect(() => {
    if (itemsQuery.data) {
      setDisplayedItems(itemsQuery.data)
    }
  }, [itemsQuery.data])

  return (
    <div className="flex h-full w-full grid grid-cols-[repeat(3,minmax(300px,1fr))] overflow-auto rounded-xl border border-default-200">
      {itemsQuery.isError ? (
        <>
          <div />
          <div className="h-full flex items-center justify-center">Failed to load Roadmap</div>
          <div />
        </>
      ) : (
        itemGroups.map(({ group, color }, index) => {
          const groupItems = displayedItems.filter((item) => item.status?.group === group)
          return (
            <ScrollShadow
              key={group}
              className={twMerge("flex flex-col h-full rounded-lg space-y-4 p-4", "overflow-auto")}
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
              {itemsQuery.isLoading
                ? Array(index + 1)
                    .fill(null)
                    .map((_, i) => {
                      return (
                        <Card key={i} className="shrink-0 h-24 p-4 space-y-2">
                          <Skeleton className="h-8 rounded-lg" />
                          <Skeleton className="h-6 rounded-lg w-8/12" />
                          <Skeleton className="h-6 rounded-lg w-1/2" />
                        </Card>
                      )
                    })
                : groupItems.map((item) => {
                    return (
                      <Card key={item.id} className="shrink-0 min-h-24 z-10">
                        <CardBody className="p-4 space-y-2">
                          {item.urgent ? <Chip color="danger">Urgent</Chip> : null}
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm whitespace-pre-line">{item.description}</p>
                          <Chip
                            variant="dot"
                            classNames={{
                              dot: `bg-${item.status?.color}-500`,
                              content: `text-${item.status?.color}-500`,
                            }}
                          >
                            {item.status?.name}
                          </Chip>
                        </CardBody>
                      </Card>
                    )
                  })}
            </ScrollShadow>
          )
        })
      )}
    </div>
  )
}
