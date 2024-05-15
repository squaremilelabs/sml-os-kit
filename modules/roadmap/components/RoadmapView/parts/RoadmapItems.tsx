import useRoadmapItemsQuery from "@/~sml-os-kit/modules/roadmap/hooks/useRoadmapItemsQuery"
import {
  RoadmapItem,
  RoadmapItemType,
  RoadmapStatusGroupName,
} from "@/~sml-os-kit/modules/roadmap/types"
import { mdiAlertCircleOutline, mdiExclamation } from "@mdi/js"
import Icon from "@mdi/react"
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
    <div className="flex h-full w-full grid grid-cols-[repeat(3,minmax(300px,1fr))] overflow-x-auto rounded-xl border border-default-200">
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
              className={twMerge("flex flex-col h-full rounded-lg space-y-2 p-2", "overflow-auto")}
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
                        <Card
                          key={i}
                          className="shrink-0 py-2 px-3 space-y-2 border border-default-200"
                          shadow="none"
                        >
                          <Skeleton className="h-4 rounded-lg" />
                          <Skeleton className="h-4 rounded-lg w-8/12" />
                          <Skeleton className="h-4 rounded-lg w-1/2" />
                        </Card>
                      )
                    })
                : groupItems.map((item) => {
                    return (
                      <Card
                        key={item.id}
                        className="shrink-0 z-10 bg-background dark:bg-content2 border border-default-200"
                        shadow="none"
                        radius="sm"
                      >
                        <CardBody className="py-2 px-3 space-y-1">
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-tiny whitespace-pre-line">{item.description}</p>
                          <div className="flex items-center space-x-2">
                            {item.urgent ? (
                              <Chip color="danger" size="sm">
                                Urgent
                              </Chip>
                            ) : null}
                            <Chip
                              variant="dot"
                              size="sm"
                              classNames={{
                                dot: `bg-${item.status?.color}-500`,
                                content: `text-${item.status?.color}-500`,
                              }}
                            >
                              {item.status?.name}
                            </Chip>
                          </div>
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
