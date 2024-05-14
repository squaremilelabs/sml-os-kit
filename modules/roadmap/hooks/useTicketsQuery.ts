import { useQuery } from "@tanstack/react-query"
import _fetchTickets from "../functions/_fetchTickets"

export default function useTicketsQuery() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      console.log("Refetching tickets")
      const tickets = await _fetchTickets()
      console.log("New tickets:")
      console.log(tickets)
      return tickets
    },
  })
}
