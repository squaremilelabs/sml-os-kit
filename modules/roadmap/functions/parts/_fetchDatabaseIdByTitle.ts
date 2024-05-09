"use server"

import { getSiteConfig } from "../../../../config/functions"
import notion, { isFullBlock } from "./_notionAPI"

export default async function fetchDatabaseIdByTitle(title: string) {
  const siteConfig = getSiteConfig()
  const blocks = await notion.blocks.children.list({
    block_id: siteConfig.roadmap.notionDatabasePageId,
  })
  const database = blocks.results.find(
    (block) =>
      isFullBlock(block) && block.type === "child_database" && block.child_database.title === title
  )

  if (!database?.id) throw new Error(`${title} notion database not found`)
  return database.id
}
