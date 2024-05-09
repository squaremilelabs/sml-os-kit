"use server"
import { getSiteConfig } from "../../../config/functions"
import notion, { isFullBlock } from "./parts/_notionAPI"

export interface CreateTicketInput {
  title: string
  description: string
  urgent: boolean
  creatorEmail: string
}

const defaultStatus = "Triage"

export default async function createTicket({
  title,
  description,
  urgent,
  creatorEmail,
}: CreateTicketInput) {
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
            content: title,
          },
        },
      ],
    },
    "Description": {
      rich_text: [
        {
          text: {
            content: description,
          },
        },
      ],
    },
    "Creator Email": { email: creatorEmail },
    "Status": { status: { name: defaultStatus } },
  } as Record<string, any>

  if (urgent) {
    properties["Urgent"] = { select: { name: "Urgent" } }
  }

  const response = await notion.pages.create({
    parent: { database_id: ticketsDatabaseId },
    properties,
  })
  return response
}
