"use client"

import { mdiChevronRight } from "@mdi/js"
import Icon from "@mdi/react"
import { Button, Divider, Link, ScrollShadow } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import React from "react"

export default function DemoRecordPage({
  title,
  backLabel,
  children,
}: {
  title: string
  backLabel: string
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <div className="grid grid-rows-[auto_minmax(0,1fr)] h-full w-full lg:w-8/12 self-center p-4 space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-1">
          <Link size="sm" className="cursor-pointer font-medium" onClick={() => router.back()}>
            {backLabel}
          </Link>
          <Icon path={mdiChevronRight} className="w-4 text-default-500" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
        </div>
      </div>
      <ScrollShadow>{children}</ScrollShadow>
    </div>
  )
}
