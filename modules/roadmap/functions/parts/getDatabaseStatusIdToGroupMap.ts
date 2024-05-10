import { StatusGroup } from "../../types"
import { NotionDatabase, NotionPropertyConfig, NotionStatusGroup } from "./notionAPI"

const statusGroupMap: Record<NotionStatusGroup, StatusGroup> = {
  "To-do": "Open",
  "In progress": "Active",
  "Complete": "Closed",
}

export default function getDatabaseStatusIdToGroupMap(
  database: NotionDatabase & {
    properties: {
      Status: NotionPropertyConfig<"status">
    }
  }
) {
  return database.properties["Status"].status?.groups.reduce(
    (final, each) => {
      each.option_ids.map((id) => {
        final[id] = statusGroupMap[each.name as NotionStatusGroup]
      })
      return final
    },
    {} as Record<string, StatusGroup>
  )
}
