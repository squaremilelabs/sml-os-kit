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

export default async function fetchPatches() {
  const patchesDatabase = (await fetchDatabaseByTitle("Patches")) as NotionPatchesDatabase
  const queryResponse = await notion.databases.query({
    database_id: patchesDatabase.id,
  })

  const patches = extractPatches(patchesDatabase, queryResponse)
  return patches
}

function extractPatches(
  database: NotionPatchesDatabase,
  response: NotionDBQueryResponse
): RoadmapPatch[] {
  const statusGroupMap = database.properties["Status"].status?.groups.reduce(
    (final, each) => {
      each.option_ids.map((id) => {
        final[id] = each.name as StatusGroup
      })
      return final
    },
    {} as Record<string, StatusGroup>
  )
  const patches: NotionPatch[] = response.results.map((patch) => patch as NotionPatch)

  return patches.map((patch) => ({
    id: patch.id,
    url: patch.url,
    title: patch.properties["Title"].title[0].plain_text,
    description: patch.properties["Description"].rich_text[0].plain_text,
    createdTime: new Date(patch.properties["Created Date"].created_time),
    status: patch.properties["Status"].status!.name,
    statusGroup: statusGroupMap[patch.properties["Status"].status!.id],
    urgent: patch.properties["Urgent"].select?.name === "Urgent",
    size: patch.properties["Size"].select?.name,
    tickets: patch.properties["Tickets"].relation.map((ticket) => ticket.id),
  }))
}
