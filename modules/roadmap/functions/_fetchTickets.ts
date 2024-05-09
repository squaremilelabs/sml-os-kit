"use server"
import fetchDatabaseIdByTitle from "./parts/_fetchDatabaseIdByTitle"
import notion from "./parts/_notionAPI"

export default async function fetchTickets() {
  const ticketsDatabaseId = await fetchDatabaseIdByTitle("Tickets")
  const tickets = await notion.databases.query({
    database_id: ticketsDatabaseId,
  })
  return tickets.results
}
