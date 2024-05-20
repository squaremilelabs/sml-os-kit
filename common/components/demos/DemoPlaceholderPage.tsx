"use client"

import { Image } from "@nextui-org/react"
import { usePathname } from "next/navigation"
import BrandLogo from "../BrandLogo"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"
import siteConfig from "@/$sml-os-config/site"

export default function DemoPlaceholderPage() {
  const pathname = usePathname()

  let pageTitle: string | undefined

  const allNavItems = [
    ...siteConfig.console.navigation,
    ...Array.from(siteConfig.portals?.entries() ?? [])
      .map(([i, config]) => config.navigation)
      .flat(),
  ]

  const pageItem = allNavItems.find((item) => {
    if (item.type === "group") {
      return item.items.some((innerItem) => innerItem.href === pathname)
    } else {
      return item.href === pathname
    }
  })

  if (pageItem?.type === "group") {
    const innerPageItem = pageItem.items.find((item) => item.href === pathname)
    pageTitle = innerPageItem?.label
  } else {
    pageTitle = pageItem?.label
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
      <h1 className="text-2xl font-medium">{pageTitle}</h1>
      <p>Let&apos;s build together</p>
      <div className="flex flex-row items-center space-x-1">
        <BrandLogo className="w-6" />
        <Icon path={mdiPlus} className="w-4" />
        <Image
          src="https://i.ibb.co/W2b0nX9/sml-gold.png"
          alt="Square Mile Labs"
          className="w-6"
          radius="none"
        />
      </div>
    </div>
  )
}
