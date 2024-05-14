"use server"
import { RoadmapPatch, StatusGroup } from "../types"
import notion, {
  NotionDBQueryResponse,
  NotionPage,
  NotionDatabase,
  NotionProperty,
  NotionPropertyConfig,
} from "./parts/notionAPI"
import fetchDatabaseByTitle from "./parts/_fetchDatabaseByTitle"
import getDatabaseStatusIdToGroupMap from "./parts/getDatabaseStatusIdToGroupMap"

type NotionPatchesDatabase = NotionDatabase & {
  properties: {
    Status: NotionPropertyConfig<"status">
  }
}

type NotionPatch = NotionPage & {
  properties: {
    "Title": NotionProperty<"title">
    "Created Date": NotionProperty<"created_time">
    "Description": NotionProperty<"rich_text">
    "Status": NotionProperty<"status">
    "Urgent": NotionProperty<"select">
    "Size": NotionProperty<"select">
    "Tickets": NotionProperty<"relation">
  }
}

export default async function _fetchPatches() {
  const patchesDatabase = (await fetchDatabaseByTitle("Patches")) as NotionPatchesDatabase
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const queryResponse = await notion.databases.query({
    database_id: patchesDatabase.id,
    filter: {
      or: [
        {
          property: "Closed Date",
          date: { is_empty: true },
        },
        {
          property: "Closed Date",
          date: { on_or_after: thirtyDaysAgo.toISOString() },
        },
      ],
    },
  })
  const statusIdToGroupMap = getDatabaseStatusIdToGroupMap(patchesDatabase)
  const patches = extractPatches(queryResponse, statusIdToGroupMap)
  console.log(`Patches fetched: ${patches.length}`)
  return patches
}

function extractPatches(
  response: NotionDBQueryResponse,
  statusIdToGroupMap: Record<string, StatusGroup>
): RoadmapPatch[] {
  const patches: NotionPatch[] = response.results.map((patch) => patch as NotionPatch)

  return patches.map((patch) => ({
    id: patch.id,
    url: patch.url,
    title: patch.properties["Title"].title[0].plain_text,
    description: patch.properties["Description"].rich_text[0]?.plain_text,
    createdTime: new Date(patch.properties["Created Date"].created_time),
    status: patch.properties["Status"].status!.name,
    statusGroup: statusIdToGroupMap[patch.properties["Status"].status!.id],
    urgent: patch.properties["Urgent"].select?.name === "Urgent",
    size: patch.properties["Size"].select?.name,
    tickets: patch.properties["Tickets"].relation.map((ticket) => ticket.id),
  }))
}
