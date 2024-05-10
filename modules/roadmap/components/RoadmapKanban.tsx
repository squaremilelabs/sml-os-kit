import { Card, CardBody, CardFooter, CardHeader, Chip, ScrollShadow } from "@nextui-org/react"
import { RoadmapFeature, RoadmapPatch, RoadmapTicket, StatusGroup } from "../types"

const groups: StatusGroup[] = ["Open", "Active", "Closed"]

export default function RoadmapKanban({
  items,
}: {
  items: RoadmapTicket[] | RoadmapFeature[] | RoadmapPatch[] | undefined
}) {
  if (!items) return null
  return (
    <div className="w-full h-full grid grid-cols-3 space-x-4">
      {groups.map((group) => (
        <div className="h-full" key={group}>
          <h2 className="text-center font-semibold text-xl">{group}</h2>
          <ScrollShadow
            key={group}
            className="h-full bg-content2 justify-items-start align-items-center rounded-md space-y-4 p-4"
          >
            {items
              ?.filter((item) => item.statusGroup === group)
              .map((item) => (
                <Card key={item.id} className="p-2">
                  <CardHeader className="justify-between">
                    <p className="font-semibold">{item.title}</p>
                    {"urgent" in item && item.urgent && <Chip color="danger">Urgent</Chip>}
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm">{item.description}</p>
                  </CardBody>
                  <CardFooter>
                    <Chip
                      color={
                        group === "Open" ? "default" : group === "Active" ? "warning" : "success"
                      }
                    >
                      {item.status}
                    </Chip>
                  </CardFooter>
                </Card>
              ))}
          </ScrollShadow>
        </div>
      ))}
    </div>
  )
}
