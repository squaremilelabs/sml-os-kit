import { useQuery } from "@tanstack/react-query"
import fetchTickets from "../functions/_fetchTickets"

export default function useTicketsQuery() {
  return useQuery({
    queryKey: ["roadmap", "tickets"],
    queryFn: async () => {
      const tickets = await fetchTickets()
      return tickets
    },
  })
}
