"use server"
import { RoadmapFeature, StatusGroup } from "../types"
import fetchDatabaseByTitle from "./parts/_fetchDatabaseByTitle"
import getDatabaseStatusIdToGroupMap from "./parts/getDatabaseStatusIdToGroupMap"
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

export default async function _fetchFeatures() {
  const featuresDatabase = (await fetchDatabaseByTitle("Features")) as NotionFeaturesDatabase
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const queryResponse = await notion.databases.query({
    database_id: featuresDatabase.id,
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
  const statusIdToGroupMap = getDatabaseStatusIdToGroupMap(featuresDatabase)
  const features = extractFeatures(queryResponse, statusIdToGroupMap)
  console.log(features)
  return features
}

function extractFeatures(
  response: NotionDBQueryResponse,
  statusIdToGroupMap: Record<string, StatusGroup>
): RoadmapFeature[] {
  const features: NotionFeature[] = response.results.map((feature) => feature as NotionFeature)

  return features.map((feature) => ({
    id: feature.id,
    url: feature.url,
    title: feature.properties["Title"].title[0].plain_text,
    description: feature.properties["Description"].rich_text[0]?.plain_text,
    createdTime: new Date(feature.properties["Created Date"].created_time),
    status: feature.properties["Status"].status!.name,
    statusGroup: statusIdToGroupMap[feature.properties["Status"].status!.id],
    size: feature.properties["Size"].select?.name,
    tickets: feature.properties["Tickets"].relation.map((ticket) => ticket.id),
  }))
}
