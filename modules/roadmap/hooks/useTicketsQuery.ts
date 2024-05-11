import { useQuery } from "@tanstack/react-query"
import fetchTickets from "../functions/_fetchTickets"

export default function useTicketsQuery() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      console.log("Refetching tickets")
      const tickets = await fetchTickets()
      console.log("New tickets:")
      console.log(tickets)
      return tickets
    },
  })
}
