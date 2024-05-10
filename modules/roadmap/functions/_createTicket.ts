"use server"
import { RoadmapTicket } from "@/~sml-os-kit/modules/roadmap/types"
import { getSiteConfig } from "../../../config/functions"
import notion, { isFullBlock } from "./parts/notionAPI"

export default async function _createTicket(
  input: Pick<RoadmapTicket, "title" | "description" | "urgent" | "creatorEmail">
) {
  const siteConfig = getSiteConfig()
  const blocks = await notion.blocks.children.list({
    block_id: siteConfig.roadmap.notionDatabasePageId,
  })
  const ticketsDatabaseId = blocks.results.find(
    (block) =>
      isFullBlock(block) &&
      block.type === "child_database" &&
      block.child_database.title === "Tickets"
  )?.id
  if (!ticketsDatabaseId) throw new Error("Tickets database not found")

  const properties = {
    "Title": {
      title: [
        {
          text: {
            content: input.title,
          },
        },
      ],
    },
    "Description": {
      rich_text: [
        {
          text: {
            content: input.description,
          },
        },
      ],
    },
    "Creator Email": { email: input.creatorEmail },
  } as Record<string, any>

  if (input.urgent) {
    properties["Urgent"] = { select: { name: "Urgent" } }
  }

  const response = await notion.pages.create({
    parent: { database_id: ticketsDatabaseId },
    properties,
  })
  return response
}
