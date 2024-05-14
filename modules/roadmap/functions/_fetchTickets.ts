"use server"

import notion, {
  NotionDBQueryResponse,
  NotionProperty,
  NotionPage,
  NotionDatabase,
  NotionPropertyConfig,
} from "./parts/notionAPI"
import { RoadmapTicket, StatusGroup } from "../types"
import fetchDatabaseByTitle from "./parts/_fetchDatabaseByTitle"
import getDatabaseStatusIdToGroupMap from "./parts/getDatabaseStatusIdToGroupMap"

type NotionTicketsDatabase = NotionDatabase & {
  properties: {
    Status: NotionPropertyConfig<"status">
  }
}

type NotionTicket = NotionPage & {
  properties: {
    "Title": NotionProperty<"title">
    "Created Date": NotionProperty<"created_time">
    "Description": NotionProperty<"rich_text">
    "Creator Email": NotionProperty<"email">
    "Urgent": NotionProperty<"select">
    "Status": NotionProperty<"status">
    "Closed Date": NotionProperty<"date">
  }
}

export default async function _fetchTickets() {
  try {
    const ticketsDatabase = (await fetchDatabaseByTitle("Tickets")) as NotionTicketsDatabase
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const queryResponse = await notion.databases.query({
      database_id: ticketsDatabase.id,
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
    const statusIdToGroupMap = getDatabaseStatusIdToGroupMap(ticketsDatabase)
    const tickets = extractTickets(queryResponse, statusIdToGroupMap)
    const filtered = filterTickets(tickets)
    const sorted = sortTickets(filtered)
    console.log(`Tickets fetched: ${sorted.length}`)
    return sorted
  } catch (error) {
    console.error(error)
    return []
  }
}

function extractTickets(
  response: NotionDBQueryResponse,
  statusIdToGroupMap: Record<string, StatusGroup>
): RoadmapTicket[] {
  const tickets: NotionTicket[] = response.results.map((ticket) => ticket as NotionTicket)

  return tickets.map((ticket) => ({
    id: ticket.id,
    url: ticket.url,
    title: ticket.properties["Title"].title[0].plain_text,
    description: ticket.properties["Description"].rich_text[0].plain_text,
    createdTime: new Date(ticket.properties["Created Date"].created_time),
    creatorEmail: ticket.properties["Creator Email"]?.email,
    status: ticket.properties["Status"].status!.name,
    statusGroup: statusIdToGroupMap?.[ticket.properties["Status"].status!.id],
    urgent: ticket.properties["Urgent"].select?.name === "Urgent",
    closedDate: ticket.properties["Closed Date"].date?.start,
  }))
}

function filterTickets(tickets: RoadmapTicket[]) {
  // Filter out tickets that have closedDate > 30 days ago
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const filteredTickets = tickets.filter((ticket) => {
    return !ticket.closedDate || new Date(ticket.closedDate) > thirtyDaysAgo
  })

  return filteredTickets
}
function sortTickets(tickets: RoadmapTicket[]) {
  //Sort tickets by urgent first, then status (desc), then createdTime (desc)
  return tickets.sort((a, b) => {
    // Sort by urgent first
    if (a.urgent && !b.urgent) {
      return -1
    }
    if (!a.urgent && b.urgent) {
      return 1
    }

    // TODO - how should status sort work
    if (a.status > b.status) {
      return -1
    }
    if (a.status < b.status) {
      return 1
    }

    // Sort by createdTime (desc)
    if (a.createdTime > b.createdTime) {
      return -1
    }
    if (a.createdTime < b.createdTime) {
      return 1
    }

    return 0
  })
}
