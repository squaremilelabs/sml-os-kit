"use server"
import { RoadmapFeature, StatusGroup } from "../types"
import fetchDatabaseByTitle from "./parts/_fetchDatabaseByTitle"
import notion, {
  NotionDBQueryResponse,
  NotionProperty,
  NotionDatabase,
  NotionPropertyConfig,
  NotionPage,
} from "./parts/notionAPI"

type NotionFeaturesDatabase = NotionDatabase & {
  properties: {
    Status: NotionPropertyConfig<"status">
  }
}

type NotionFeature = NotionPage & {
  properties: {
    "Title": NotionProperty<"title">
    "Created Date": NotionProperty<"created_time">
    "Description": NotionProperty<"rich_text">
    "Status": NotionProperty<"status">
    "Size": NotionProperty<"select">
    "Tickets": NotionProperty<"relation">
  }
}

export default async function fetchFeatures() {
  const featuresDatabase = (await fetchDatabaseByTitle("Features")) as NotionFeaturesDatabase
  const queryResponse = await notion.databases.query({
    database_id: featuresDatabase.id,
  })
  const features = extractFeatures(featuresDatabase, queryResponse)
  return features
}

function extractFeatures(
  database: NotionFeaturesDatabase,
  response: NotionDBQueryResponse
): RoadmapFeature[] {
  const statusGroupMap = database.properties["Status"].status?.groups.reduce(
    (final, each) => {
      each.option_ids.map((id) => {
        final[id] = each.name as StatusGroup
      })
      return final
    },
    {} as Record<string, StatusGroup>
  )
  const features: NotionFeature[] = response.results.map((feature) => feature as NotionFeature)

  return features.map((feature) => ({
    id: feature.id,
    url: feature.url,
    title: feature.properties["Title"].title[0].plain_text,
    description: feature.properties["Description"].rich_text[0].plain_text,
    createdTime: new Date(feature.properties["Created Date"].created_time),
    status: feature.properties["Status"].status!.name,
    statusGroup: statusGroupMap[feature.properties["Status"].status!.id],
    size: feature.properties["Size"].select?.name,
    tickets: feature.properties["Tickets"].relation.map((ticket) => ticket.id),
  }))
}
