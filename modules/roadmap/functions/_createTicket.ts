"use server"
import { RoadmapItem } from "@/~sml-os-kit/modules/roadmap/types"
import { Client } from "@notionhq/client"
import modulesConfig from "@/$sml-os-config/modules"

export default async function _createTicket(
  input: Pick<RoadmapItem, "title" | "description" | "urgent" | "creatorEmail">
) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const ticketsDatabaseId = modulesConfig.roadmap.notion.ticketsDatabaseId
  if (!ticketsDatabaseId) throw new Error("Tickets database not found")
  if (!input.title) throw new Error("Title is required")

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
