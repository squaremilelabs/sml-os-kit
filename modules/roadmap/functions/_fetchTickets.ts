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

export default async function fetchTickets() {
  const ticketsDatabase = (await fetchDatabaseByTitle("Tickets")) as NotionTicketsDatabase
  const queryResponse = await notion.databases.query({
    database_id: ticketsDatabase.id,
    //TODO - filter "completed" status to be within last 30 days
  })
  const statusIdToGroupMap = getDatabaseStatusIdToGroupMap(ticketsDatabase)
  const tickets = extractTickets(queryResponse, statusIdToGroupMap)
  return tickets
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
