import useRoadmapItemsQuery from "@/~sml-os-kit/modules/roadmap/hooks/useRoadmapItemsQuery"
import {
  RoadmapItem,
  RoadmapItemType,
  RoadmapStatusGroupName,
} from "@/~sml-os-kit/modules/roadmap/types"
import { Card, CardBody, Chip, Skeleton } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { useLayoutEffect, useState } from "react"
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
    <div className="flex grid h-full w-full grid-cols-[repeat(3,minmax(300px,1fr))] overflow-x-auto rounded-xl border border-default-200 shadow-lg">
      {itemsQuery.isError ? (
        <>
          <div />
          <div className="flex h-full items-center justify-center">Failed to load Roadmap</div>
          <div />
        </>
      ) : (
        itemGroups.map(({ group, color }, index) => {
          const groupItems = displayedItems.filter((item) => item.status?.group === group)
          return (
            <div
              key={group}
              className={twMerge("flex h-full flex-col space-y-2 rounded-lg", "overflow-auto")}
            >
              <div className="sticky top-0 z-20 bg-background p-2 pb-0">
                <div
                  className={twMerge(
                    `rounded-lg p-2 text-center font-medium`,
                    theme === "light" ? `bg-${color}-100` : `bg-${color}-800`
                  )}
                >
                  {group}
                </div>
              </div>
              {itemsQuery.isLoading
                ? Array(index + 1)
                    .fill(null)
                    .map((_, i) => {
                      return (
                        <Card
                          key={i}
                          className="mx-2 shrink-0 space-y-2 border border-default-200 px-3 py-2"
                          shadow="none"
                          radius="sm"
                        >
                          <Skeleton className="h-4 rounded-lg" />
                          <Skeleton className="h-4 w-8/12 rounded-lg" />
                          <Skeleton className="h-4 w-1/2 rounded-lg" />
                        </Card>
                      )
                    })
                : groupItems.map((item) => {
                    return (
                      <Card
                        key={item.id}
                        className="z-10 mx-2 shrink-0 border border-default-200 bg-background dark:bg-content2"
                        shadow="none"
                        radius="sm"
                      >
                        <CardBody className="space-y-1 px-3 py-2">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="whitespace-pre-line text-tiny">{item.description}</p>
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
            </div>
          )
        })
      )}
    </div>
  )
}
