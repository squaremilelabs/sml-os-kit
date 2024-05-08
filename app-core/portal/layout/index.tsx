"use client"
import BrandLogo from "@/~sml-os-kit/common/components/BrandLogo"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import brandConfig from "@/$sml-os-config/brand"
import { Button, Popover, PopoverContent, PopoverTrigger, Spacer } from "@nextui-org/react"
import ThemeSwitch from "@/~sml-os-kit/common/components/ThemeSwitch"
import Icon from "@mdi/react"
import { mdiMenu } from "@mdi/js"
import AuthWrapper from "@/~sml-os-kit/modules/auth/wrapper"
import PortalUser from "./parts/PortalUser"
import usePortalAgent from "@/~sml-os-kit/modules/portal-agent/usePortalAgent"
import AdminPortalUserSelect from "./parts/AdminPortalUserSelect"

export default function PortalLayout({ children }: { children?: React.ReactNode }) {
  const { isAdminAgent, portalUser } = usePortalAgent({ initializeListeners: true })
  const [title, setTitle] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    const siteConfig = getSiteConfig()
    const portalConfig = siteConfig.portals?.find((p) => pathname.startsWith(p.basePath))
    setTitle(portalConfig?.title ?? "Portal")
  }, [pathname])

  return (
    <AuthWrapper>
      <main>
        {/* DESKTOP HERO */}
        <section className="fixed hidden md:flex flex-col space-y-8 p-8 h-full w-[30vw] border-r-1 border-default-200 bg-content2">
          <div className="flex-col space-y-2">
            <div className="flex flex-row items-center space-x-1">
              <BrandLogo width={24} />
              <p className="font-medium text-lg">{brandConfig.orgName}</p>
            </div>
            <h1 className="text-4xl text-primary">{title}</h1>
          </div>
          <PortalUser />
          <Spacer className="grow" />
          <ThemeSwitch />
        </section>
        {/* MOBILE HEADER */}
        <section className="fixed w-full flex md:hidden flex-row items-center h-[50px] px-4 justify-between overflow-hidden bg-background">
          <div className="flex flex-row items-center space-x-1">
            <BrandLogo width={20} />
            <h1 className="text-md font-medium truncate">{title}</h1>
          </div>
          <div className="flex flex-row">
            <Popover placement="bottom-end" radius="sm" isDismissable>
              <PopoverTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon path={mdiMenu} className="w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 flex flex-col items-stretch space-y-2 bg-content2 min-w-72">
                <PortalUser />
                <ThemeSwitch withLabel />
              </PopoverContent>
            </Popover>
          </div>
        </section>
        {/* CANVAS */}
        <section className="pt-[50px] md:pt-0 overflow-auto w-full md:w-8/12 md:ml-[30vw] h-screen">
          {portalUser ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              {isAdminAgent ? <AdminPortalUserSelect /> : null}
            </div>
          )}
        </section>
      </main>
    </AuthWrapper>
  )
}
