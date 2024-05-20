"use client"
import React from "react"
import NavItems from "./parts/NavItems"
import useNavState from "./parts/useNavState"
import { Button } from "@nextui-org/react"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuClose } from "@mdi/js"
import ConsoleUser from "@/~sml-os-kit/app-core/shared-layout/parts/ConsoleUser"
import ThemeSwitch from "@/~sml-os-kit/app-core/shared-layout/parts/ThemeSwitch"
import RoadmapNavButton from "@/~sml-os-kit/modules/roadmap/components/RoadmapNavButton"
import useScreenSize from "@/~sml-os-kit/common/hooks/useScreenSize"
import { usePathname } from "next/navigation"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"
import BrandLogotype from "@/~sml-os-kit/common/components/BrandLogotype"
import brandConfig from "@/$sml-os-config/brand"
import AuthWrapper from "@/~sml-os-kit/auth/wrapper"
import PortalUser from "@/~sml-os-kit/app-core/shared-layout/parts/PortalUser"

export default function SharedLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const basePath = pathname.split("/")[1]
  const portal = getPortalConfigFromPathname(pathname)
  const { navOpen, setNavOpen } = useNavState()
  const screenSize = useScreenSize()

  return (
    <AuthWrapper>
      <main>
        {/* NAVIGATION */}
        <section
          className={`fixed top-0 ${navOpen ? "left-0 opacity-100" : "left-[-768px] opacity-0"} z-10 flex h-screen w-screen flex-col space-y-4 rounded-r-sm border-r-1 border-default-200 bg-content2 py-4 transition-all md:w-72`}
        >
          <div className="flex w-full flex-row items-center justify-between space-x-1 px-4">
            <BrandLogotype title={portal?.title ?? brandConfig.appName} />
            <Button
              isIconOnly
              className="text-foreground transition-all md:text-default-400"
              size="sm"
              variant="light"
              onPress={() => setNavOpen(false)}
            >
              <Icon path={mdiMenuClose} rotate={180} size="24px" />
            </Button>
          </div>
          {basePath === "portal" ? <PortalUser /> : null}
          <NavItems />
          <div className="flex h-fit flex-col items-stretch space-y-2 px-4">
            {basePath === "console" ? <ConsoleUser /> : null}
            <div className="flex flex-row items-stretch">
              <ThemeSwitch />
              {basePath === "console" ? (
                <RoadmapNavButton
                  href="/console/core/roadmap"
                  onPress={navOpen && screenSize !== "lg" ? () => setNavOpen(false) : undefined}
                />
              ) : null}
            </div>
          </div>
        </section>
        {/* HEADER */}
        <section
          className={`fixed left-0 ${navOpen ? "top-[-50px]" : "top-0"} flex h-[50px] w-full flex-row items-center justify-between space-x-1 bg-background px-4 transition-all`}
        >
          <BrandLogotype title={portal?.title ?? brandConfig.appName} size="sm" />
          <Button isIconOnly size="sm" variant="light" onPress={() => setNavOpen(true)}>
            <Icon path={mdiMenu} size="24px" />
          </Button>
        </section>
        {/* CANVAS */}
        <section className={`${navOpen ? "ml-72" : "ml-0"} h-screen transition-all`}>
          <div
            className={`${navOpen ? "pt-0 opacity-0 md:opacity-100" : "pt-[50px]"} flex h-full h-screen flex-col overflow-auto transition-all`}
          >
            {children}
          </div>
        </section>
      </main>
    </AuthWrapper>
  )
}