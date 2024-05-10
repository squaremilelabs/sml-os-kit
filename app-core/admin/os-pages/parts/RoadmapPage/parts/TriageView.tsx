import { Tab, Tabs } from "@nextui-org/react"
import useTicketsQuery from "@/~sml-os-kit/modules/roadmap/hooks/useTicketsQuery"
import RoadmapKanban from "@/~sml-os-kit/modules/roadmap/components/RoadmapKanban"
import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"
import { Key, useEffect, useState } from "react"
import { RoadmapTicket } from "@/~sml-os-kit/modules/roadmap/types"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import { useSearchParams } from "next/navigation"

export default function TriageView() {
  const ticketsQuery = useTicketsQuery()
  const { push, query } = usePageRouter()
  const { user } = useAuthState()

  const searchParams = useSearchParams()
  const [displayedTickets, setDisplayedTickets] = useState<RoadmapTicket[]>([])

  useEffect(() => {
    if (!ticketsQuery.data) return
    let filteredTickets = [...ticketsQuery.data]
    if (searchParams.get("filter") === "mine") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.creatorEmail === user?.email)
    }
    setDisplayedTickets(filteredTickets)
  }, [ticketsQuery.data, searchParams, user])

  const selectTab = (key: Key) => {
    push(null, { ...query, filter: key.toString() })
  }

  return (
    <div className="grid grid-rows-[auto,auto,1fr] space-y-8">
      <div>
        <h1 className="font-semibold text-2xl">Triage</h1>
        <p> Raw / Ungroomed Tickets</p>
      </div>
      <Tabs onSelectionChange={(key) => selectTab(key)} selectedKey={searchParams.get("filter")}>
        <Tab key="all" title="All" />
        <Tab key="mine" title="Mine" />
      </Tabs>
      <RoadmapKanban items={displayedTickets} />
    </div>
  )
}
