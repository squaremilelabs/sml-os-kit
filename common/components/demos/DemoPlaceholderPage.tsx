"use client"

import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import { Image } from "@nextui-org/react"
import { usePathname } from "next/navigation"
import BrandLogo from "../BrandLogo"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"

export default function DemoPlaceholderPage() {
  const pathname = usePathname()
  const siteConfig = getSiteConfig()

  let pageTitle = ""
  let pageItem = siteConfig.admin.navigation.find(
    (item) => item.href === pathname || item.items?.find((innerItem) => innerItem.href === pathname)
  )
  if (pageItem?.items?.length) {
    pageItem = pageItem.items.find((item) => item.href === pathname)
  }
  if (pageItem) {
    pageTitle = pageItem.label
  }

  return (
    <div className="h-full w-full flex flex-col space-y-2 items-center justify-center">
      <h1 className="text-2xl font-medium">{pageTitle}</h1>
      <p>Let&apos;s build this page together!</p>
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
