"use client"
import modulesConfig from "@/$sml-os-config/modules"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import NewTicketModal from "@/~sml-os-kit/modules/roadmap/components/RoadmapView/parts/NewTicketModal"
import RoadmapItems from "@/~sml-os-kit/modules/roadmap/components/RoadmapView/parts/RoadmapItems"
import { roadmapTypeInfoMap } from "@/~sml-os-kit/modules/roadmap/constants"
import { RoadmapItemType } from "@/~sml-os-kit/modules/roadmap/types"
import Icon from "@mdi/react"
import { Button, Image, Tab, Tabs, useDisclosure } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"

export default function RoadmapView({
  selectedType,
  onSelectType,
}: {
  selectedType: RoadmapItemType
  onSelectType: (selection: RoadmapItemType) => any
}) {
  const roadmapUrl = modulesConfig?.roadmap?.notion?.roadmapUrl
  const { isOpen, onClose } = useDisclosure()

  const queryClient = useQueryClient()
  const handleNewTicketSubmit = () => {
    onClose()
    onSelectType("ticket")
    queryClient.invalidateQueries({ queryKey: ["roadmap"] })
  }

  return (
    <div className="grid h-full w-olg max-w-full grid-rows-[auto_auto_1fr] gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-medium">Roadmap</h1>
        </div>
        <Button
          size="sm"
          as={Link}
          target="_blank"
          href={roadmapUrl}
          variant="ghost"
          isDisabled={!roadmapUrl}
          startContent={
            <Image
              alt="Notion"
              src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
              className="w-4 rounded-none"
            />
          }
        >
          Open in Notion
        </Button>
        <NewTicketModal isOpen={isOpen} onClose={onClose} onAfterSubmit={handleNewTicketSubmit} />
      </div>
      <Tabs
        size="md"
        radius="sm"
        classNames={{
          base: "max-w-full overflow-x-auto",
          tabList: "w-full border border-default-200",
        }}
        selectedKey={selectedType}
        onSelectionChange={(key) => onSelectType(key as RoadmapItemType)}
      >
        {Array.from(roadmapTypeInfoMap.entries()).map(([type, info]) => {
          return (
            <Tab
              key={type}
              title={
                <div className="flex items-center space-x-2">
                  <Icon path={info.iconPath} className="w-4" />
                  <h2>{info.title}</h2>
                </div>
              }
            />
          )
        })}
      </Tabs>
      <RoadmapItems type={selectedType} />
    </div>
  )
}
