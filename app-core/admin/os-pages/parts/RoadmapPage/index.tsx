"use client"

import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"
import useScreenSize from "@/~sml-os-kit/common/hooks/useScreenSize"
import { mdiHammerScrewdriver, mdiPackageVariantClosed, mdiPlus, mdiShuffle } from "@mdi/js"
import Icon from "@mdi/react"
import { ScrollShadow, Tab, Tabs } from "@nextui-org/react"
import { useSearchParams } from "next/navigation"
import { Key, useEffect, useState } from "react"
import NewTicketForm from "@/~sml-os-kit/modules/roadmap/components/NewTicketForm"
import useFeaturesQuery from "@/~sml-os-kit/modules/roadmap/hooks/useFeaturesQuery"
import RoadmapKanban, { ItemCard } from "@/~sml-os-kit/modules/roadmap/components/RoadmapKanban"
import usePatchesQuery from "@/~sml-os-kit/modules/roadmap/hooks/usePatchesQuery"
import useTicketsQuery from "@/~sml-os-kit/modules/roadmap/hooks/useTicketsQuery"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import { RoadmapTicket } from "@/~sml-os-kit/modules/roadmap/types"

export default function RoadmapPage() {
  const screenSize = useScreenSize()
  const searchParams = useSearchParams()
  const { push } = usePageRouter()

  const selectTab = (key: Key) => {
    push(null, { tab: key.toString() })
  }

  return (
    <div className="max-h-screen overflow-auto p-4">
      <Tabs
        isVertical={screenSize === "md" || screenSize === "lg"}
        classNames={{
          tabList: "w-full md:w-60",
          tab: "justify-start",
          panel: "h-full overflow-auto w-full",
          wrapper:
            "h-full overflow-auto w-full grid grid-rows-[auto,1fr] md:grid-cols-[auto,1fr] md:grid-rows-none gap-4 ",
        }}
        onSelectionChange={(key) => selectTab(key)}
        selectedKey={searchParams.get("tab")}
      >
        <Tab key="new-ticket" title={<TabComponent title="New Ticket" icon={mdiPlus} />}>
          <NewTicketForm />
        </Tab>
        <Tab key="triage" title={<TabComponent title="Triage" icon={mdiShuffle} />}>
          <TriageView />
        </Tab>
        <Tab key="patches" title={<TabComponent title="Patches" icon={mdiHammerScrewdriver} />}>
          <PatchesView />
        </Tab>
        <Tab
          key="features"
          title={<TabComponent title="Features" icon={mdiPackageVariantClosed} />}
        >
          <FeaturesView />
        </Tab>
      </Tabs>
    </div>
  )
}

function TabComponent({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <Icon path={icon} className="w-6" />
      <span>{title}</span>
    </div>
  )
}

function FeaturesView() {
  const { data: features, isLoading } = useFeaturesQuery()
  return (
    <div className="h-full grid grid-rows-[auto,1fr] space-y-4">
      <div>
        <h1 className="font-semibold text-2xl">Features</h1>
        <p> New features</p>
      </div>
      <RoadmapKanban items={features || []} isLoading={isLoading} />
    </div>
  )
}

function PatchesView() {
  const { data: patches, isLoading } = usePatchesQuery()

  return (
    <div className="h-full grid grid-rows-[auto,1fr] overflow-hidden space-y-4">
      <div>
        <h1 className="font-semibold text-2xl">Patches</h1>
        <p> Fixes and updates to existing features</p>
      </div>
      <RoadmapKanban items={patches || []} isLoading={isLoading} />
    </div>
  )
}

function TriageView() {
  const ticketsQuery = useTicketsQuery()
  const { push, query } = usePageRouter()
  const { user } = useAuthState()

  const searchParams = useSearchParams()
  const [displayedTickets, setDisplayedTickets] = useState<RoadmapTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (!ticketsQuery.data) return
    let filteredTickets = [...ticketsQuery.data]
    if (searchParams.get("filter") === "mine") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.creatorEmail === user?.email)
    }
    setLoading(false)
    setDisplayedTickets(filteredTickets)
  }, [ticketsQuery.data, ticketsQuery.dataUpdatedAt, searchParams, user])

  const selectTab = (key: Key) => {
    push(null, { ...query, filter: key.toString() })
  }
  console.log(ticketsQuery.data)

  return (
    <div className="h-full overflow-hidden grid grid-rows-[auto,auto,1fr] space-y-4">
      <div>
        <h1 className="font-semibold text-2xl">Triage</h1>
        <p> Raw / Ungroomed Tickets</p>
      </div>
      <Tabs onSelectionChange={(key) => selectTab(key)} selectedKey={searchParams.get("filter")}>
        <Tab key="all" title="All" />
        <Tab key="mine" title="Mine" />
      </Tabs>
      <RoadmapKanban items={displayedTickets} isLoading={loading} />
    </div>
  )
}
