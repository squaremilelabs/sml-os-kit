"use server"

import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import notion, { isFullBlock } from "./notionAPI"

export default async function fetchDatabaseByTitle(title: string) {
  const siteConfig = getSiteConfig()
  const blocks = await notion.blocks.children.list({
    block_id: siteConfig.roadmap.notionDatabasePageId,
  })
  const databaseBlock = blocks.results.find(
    (block) =>
      isFullBlock(block) && block.type === "child_database" && block.child_database.title === title
  )
  if (!databaseBlock?.id) throw new Error(`${title} notion database not found`)
  const database = await notion.databases.retrieve({
    database_id: databaseBlock.id,
  })

  return database
}
