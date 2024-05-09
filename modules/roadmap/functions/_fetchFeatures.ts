"use server"
import fetchDatabaseIdByTitle from "./parts/_fetchDatabaseIdByTitle"
import notion from "./parts/_notionAPI"

export default async function fetchFeatures() {
  const featuresDatabaseId = await fetchDatabaseIdByTitle("Features")
  const features = await notion.databases.query({
    database_id: featuresDatabaseId,
  })

  return features.results
}
