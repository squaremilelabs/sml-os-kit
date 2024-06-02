"use client"
import React from "react"
import NavItems from "./parts/NavItems"
import useNavState from "./parts/useNavState"
import { Button } from "@nextui-org/react"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuClose, mdiOpenInNew } from "@mdi/js"
import ConsoleUser from "@/~sml-os-kit/app-core/shared-layout/parts/ConsoleUser"
import ThemeSwitch from "@/~sml-os-kit/app-core/shared-layout/parts/ThemeSwitch"
import RoadmapNavButton from "@/~sml-os-kit/modules/roadmap/components/RoadmapNavButton"
import { usePathname } from "next/navigation"
import getPortalConfigFromPathname from "@/~sml-os-kit/modules/portal-utils/getPortalConfigFromPathname"
import BrandLogotype from "@/~sml-os-kit/common/components/BrandLogotype"
import brandConfig from "@/$sml-os-config/brand"
import AuthWrapper from "@/~sml-os-kit/auth/wrapper"
import PortalUser from "@/~sml-os-kit/app-core/shared-layout/parts/PortalUser"
import { twMerge } from "tailwind-merge"
import useScreenBreakpoint from "@/~sml-os-kit/common/hooks/useScreenBreakpoint"
import Link from "next/link"

export default function SharedLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const basePath = pathname.split("/")[1]
  const portal = getPortalConfigFromPathname(pathname)
  const { navOpen, setNavOpen } = useNavState()
  const breakpoint = useScreenBreakpoint()

  return (
    <AuthWrapper>
      <main>
        {/* NAVIGATION DRAWER */}
        <section
          role="navigation"
          aria-hidden={!navOpen}
          className={twMerge(
            "fixed top-0",
            `${navOpen ? "left-0 opacity-100" : "-left-oxs opacity-0"}`,
            `z-50 flex h-screen w-oxs max-w-full flex-col space-y-4 rounded-r-sm border-r-1 border-default-200 bg-content2 py-4 transition-all`
          )}
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
          <NavItems />
          <div className="flex h-fit flex-col items-stretch space-y-2 px-4">
            {basePath === "console" ? <ConsoleUser /> : null}
            {basePath === "portal" ? <PortalUser /> : null}
            <div className="flex flex-row items-stretch space-x-1">
              <ThemeSwitch />
              {basePath === "console" ? (
                <RoadmapNavButton
                  href="/console/core/roadmap"
                  onPress={navOpen && breakpoint < 3 ? () => setNavOpen(false) : undefined}
                />
              ) : (
                <Button
                  as={Link}
                  size="sm"
                  target="_blank"
                  variant="flat"
                  href={brandConfig.orgWebsite}
                  className="grow justify-between"
                  endContent={<Icon path={mdiOpenInNew} className="w-4" />}
                >
                  {brandConfig.orgName}
                </Button>
              )}
            </div>
          </div>
        </section>
        {/* HEADER WHEN NAV IS CLOSED */}
        <section
          className={twMerge(
            navOpen ? "top-[-36px]" : "top-0",
            `fixed left-0 z-50 flex h-[36px] w-full flex-row items-center justify-between space-x-1 bg-background px-2 transition-all`
          )}
        >
          <button onClick={() => setNavOpen(true)}>
            <BrandLogotype title={portal?.title ?? brandConfig.appName} size="sm" />
          </button>
          <Button isIconOnly size="sm" variant="light" onPress={() => setNavOpen(true)}>
            <Icon path={mdiMenu} size="24px" />
          </Button>
        </section>
        {/* CANVAS */}
        <section
          className={`${navOpen ? "ml-0 cursor-pointer blur-sm md:ml-oxs md:cursor-auto md:blur-none" : "ml-0"} h-screen transition-all`}
          onClick={() => (breakpoint < 3 && navOpen ? setNavOpen(false) : null)}
        >
          <div
            className={twMerge(
              "@container/canvas",
              navOpen ? "pointer-events-none pt-0 md:pointer-events-auto" : "pt-[36px]",
              `flex h-screen flex-col items-center overflow-auto transition-all`
            )}
          >
            {children}
          </div>
        </section>
      </main>
    </AuthWrapper>
  )
}
