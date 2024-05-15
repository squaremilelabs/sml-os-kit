"use server"

import modulesConfig from "@/$sml-os-config/modules"
import { roadmapStatusGroupNameMap } from "@/~sml-os-kit/modules/roadmap/constants"
import { RoadmapItem, RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import { Client } from "@notionhq/client"
import {
  GetDatabaseResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints"

export default async function _fetchRoadmapItems({
  type,
}: {
  type: RoadmapItemType
}): Promise<RoadmapItem[]> {
  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const notionConfig = modulesConfig.roadmap.notion
  const databaseId =
    type === "ticket"
      ? notionConfig.ticketsDatabaseId
      : type === "feature"
        ? notionConfig.featuresDatabaseId
        : type === "patch"
          ? notionConfig.patchesDatabaseId
          : null

  if (!databaseId) throw new Error("Invalid roadmap item type provided")

  const database = await notion.databases.retrieve({ database_id: databaseId })
  const statusOptions = extractStatusOptionsWithGroups(database.properties["Status"])

  const sorts: QueryDatabaseParameters["sorts"] = [
    { property: "Closed Date", direction: "descending" },
    { property: "Status", direction: "descending" },
    { timestamp: "created_time", direction: "descending" },
  ]

  if (type !== "feature") {
    sorts.unshift({ property: "Urgent", direction: "descending" })
  }

  const queryResponse = await notion.databases.query({
    database_id: databaseId,
    sorts,
    filter: {
      or: [
        // is not complete
        ...statusOptions
          .filter((option) => option.group?.name === "Complete")
          .map((option) => {
            return {
              property: "Status",
              status: {
                does_not_equal: option.name,
              },
            }
          }),
        // closed date is in the past month
        {
          property: "Closed Date",
          date: {
            past_month: {},
          },
        },
      ],
    },
  })

  const items: RoadmapItem[] = queryResponse.results.map((rawItem) => {
    const item = rawItem as PageObjectResponse
    const titleProperty = item.properties["Title"]
    const descriptionProperty = item.properties["Description"]
    const urgentProperty = item.properties["Urgent"]
    const statusProperty = item.properties["Status"]
    const creatorEmailProperty = item.properties["Creator Email"]
    return {
      type,
      id: rawItem.id,
      title: titleProperty?.type === "title" ? titleProperty.title?.[0]?.plain_text : "(Untitled)",
      description:
        descriptionProperty?.type === "rich_text"
          ? descriptionProperty.rich_text?.[0]?.plain_text
          : undefined,
      creatorEmail: creatorEmailProperty?.type === "email" ? creatorEmailProperty.email : undefined,
      urgent: urgentProperty?.type === "select" ? !!urgentProperty.select : false,
      status:
        statusProperty?.type === "status"
          ? {
              name: statusProperty.status?.name,
              color: statusProperty.status?.color,
              group: roadmapStatusGroupNameMap.get(
                statusOptions?.find((option) => option.id === statusProperty.status?.id)?.group
                  ?.name ?? ""
              ),
            }
          : null,
    }
  })

  return items
}

function extractStatusOptionsWithGroups(propertyConfig: GetDatabaseResponse["properties"][string]) {
  if (propertyConfig.type === "status") {
    return propertyConfig.status.options.map((option) => {
      const group = propertyConfig.status.groups.find((g) => g.option_ids.includes(option.id))
      return { ...option, group }
    })
  }
  return []
}
