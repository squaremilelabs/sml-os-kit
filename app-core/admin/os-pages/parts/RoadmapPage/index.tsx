"use client"

import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"
import useScreenSize from "@/~sml-os-kit/common/hooks/useScreenSize"
import TriageView from "@/~sml-os-kit/app-core/admin/os-pages/parts/RoadmapPage/parts/TriageView"
import { mdiHammerScrewdriver, mdiPackageVariantClosed, mdiPlus, mdiShuffle } from "@mdi/js"
import Icon from "@mdi/react"
import { Tab, Tabs } from "@nextui-org/react"
import { useSearchParams } from "next/navigation"
import { Key } from "react"
import PatchesView from "@/~sml-os-kit/app-core/admin/os-pages/parts/RoadmapPage/parts/PatchesView"
import FeaturesView from "@/~sml-os-kit/app-core/admin/os-pages/parts/RoadmapPage/parts/FeaturesView"
import NewTicketView from "@/~sml-os-kit/app-core/admin/os-pages/parts/RoadmapPage/parts/NewTicketView"

export default function RoadmapPage() {
  const screenSize = useScreenSize()
  const searchParams = useSearchParams()
  const { push } = usePageRouter()

  const selectTab = (key: Key) => {
    push(null, { tab: key.toString() })
  }

  return (
    <div className="h-full grid p-4 grid-rows-[auto_minmax(0,1fr)] md:grid-rows-none space-y-2 md:space-y-0 md:grid-cols-[auto_minmax(0,1fr)] md:space-x-2">
      <Tabs
        isVertical={screenSize === "md" || screenSize === "lg"}
        classNames={{ tabList: "w-full md:w-60", tab: "justify-start" }}
        onSelectionChange={(key) => selectTab(key)}
        selectedKey={searchParams.get("tab")}
      >
        <Tab
          key="new-ticket"
          title={
            <div className="flex flex-row space-x-2 items-center">
              <Icon path={mdiPlus} className="w-6" />
              <span>New Ticket</span>
            </div>
          }
        >
          <NewTicketView />
        </Tab>
        <Tab
          key="triage"
          title={
            <div className="flex flex-row space-x-2 items-center">
              <Icon path={mdiShuffle} className="w-6" />
              <span>Triage</span>
            </div>
          }
        >
          <TriageView />
        </Tab>
        <Tab
          key="patches"
          title={
            <div className="flex flex-row space-x-2 items-center">
              <Icon path={mdiHammerScrewdriver} className="w-6" />
              <span>Patches</span>
            </div>
          }
        >
          <PatchesView />
        </Tab>
        <Tab
          key="features"
          title={
            <div className="flex flex-row space-x-2 items-center">
              <Icon path={mdiPackageVariantClosed} className="w-6" />
              <span>Feature Roadmap</span>
            </div>
          }
        >
          <FeaturesView />
        </Tab>
      </Tabs>
    </div>
  )
}
