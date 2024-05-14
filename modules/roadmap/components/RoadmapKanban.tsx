import { Card, Chip, ScrollShadow, Skeleton } from "@nextui-org/react"
import { RoadmapFeature, RoadmapPatch, RoadmapTicket, StatusGroup } from "../types"

const groups: {
  colors: { bgLight: string; bgMed: string; bgDark: string }
  label: StatusGroup
}[] = [
  {
    colors: {
      bgLight: "bg-zinc-50",
      bgMed: "bg-zinc-200",
      bgDark: "bg-zinc-500",
    },
    label: "Open",
  },
  {
    colors: {
      bgLight: "bg-amber-50",
      bgMed: "bg-amber-200",
      bgDark: "bg-amber-500",
    },
    label: "Active",
  },
  {
    colors: {
      bgLight: "bg-emerald-50",
      bgMed: "bg-emerald-200",
      bgDark: "bg-emerald-500",
    },
    label: "Closed",
  },
]

type KanbanItem = RoadmapTicket | RoadmapFeature | RoadmapPatch

export default function RoadmapKanban({
  items,
  isLoading,
}: {
  items: KanbanItem[]
  isLoading: boolean
}) {
  return (
    <div className="w-full grid grid-cols-3 space-x-4">
      {groups.map((group) => (
        <div
          className={"justify-items-start rounded-md space-y-4 p-4 " + group.colors.bgLight}
          key={group.label}
        >
          <Chip
            className={"align-items-center p-2 " + group.colors.bgMed}
            startContent={<span className={"w-3 h-3 rounded-full " + group.colors.bgDark} />}
          >
            {group.label}
          </Chip>
          <ScrollShadow
            hideScrollBar
            size={100}
            className="h-full overflow-auto flex flex-col space-y-4 w-full "
          >
            {isLoading
              ? Array.from({ length: Math.ceil(Math.random() * 3) }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : items
                  .filter((item: KanbanItem) => item.statusGroup === group.label)
                  .map((item) => <ItemCard key={item.id} item={item} />)}
          </ScrollShadow>
        </div>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <Skeleton className="rounded-md">
      <Card className="w-full h-[100px] rounded-md" />
    </Skeleton>
  )
}
export function ItemCard({ item }: { item: KanbanItem }) {
  return (
    <Card key={item.id} className="flex flex-col space-y-2 p-4" shadow="none" radius="md" fullWidth>
      <div className="flex justify-between">
        <p className="font-semibold">{item.title}</p>
        {"urgent" in item && item.urgent && <Chip color="danger">Urgent</Chip>}
      </div>
      <p className="text-sm">{item.description}</p>
      <Chip className="align-items-center p-2 bg-content2">{item.status}</Chip>
    </Card>
  )
}
