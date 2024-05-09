"use server"
import fetchDatabaseIdByTitle from "./parts/_fetchDatabaseIdByTitle"
import notion from "./parts/_notionAPI"

export default async function fetchPatches() {
  const patchesDatabaseId = await fetchDatabaseIdByTitle("Patches")
  const patches = await notion.databases.query({
    database_id: patchesDatabaseId,
  })

  return patches.results
}
