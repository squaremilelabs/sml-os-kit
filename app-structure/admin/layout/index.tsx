"use client"
import React from "react"
import NavFooter from "./parts/NavFooter"
import NavItems from "./parts/NavItems"
import useNavState from "./parts/useNavState"
import BrandLogotype from "@/~sml-os-kit/common/components/AppLogotype"
import { Button } from "@nextui-org/react"
import Icon from "@mdi/react"
import { mdiMenu, mdiMenuClose } from "@mdi/js"
import { usePathname } from "next/navigation"
import AuthWrapper from "@/~sml-os-kit/modules/auth/wrapper"

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { navOpen, setNavOpen } = useNavState()

  return (
    <AuthWrapper>
      <main>
        {/* NAVIGATION */}
        <section
          className={`fixed top-0 ${navOpen ? "left-0" : "left-[-768px]"} h-screen w-screen md:w-72 flex flex-col py-4 space-y-4 rounded-r-sm transition-all bg-content2 border-r-1 border-default-200 z-10`}
        >
          <div className="flex flex-row items-center justify-between w-full space-x-1 px-4">
            <BrandLogotype />
            <Button
              isIconOnly
              className="text-foreground md:text-default-400 transition-all"
              size="sm"
              variant="light"
              onPress={() => setNavOpen(false)}
            >
              <Icon path={mdiMenuClose} rotate={180} size="24px" />
            </Button>
          </div>
          <NavItems />
          <NavFooter />
        </section>
        {/* HEADER */}
        <section
          className={`fixed left-0 ${navOpen ? "top-[-50px]" : "top-0"} h-[50px] transition-all flex flex-row items-center space-x-1 w-full px-4 bg-background justify-between`}
        >
          <BrandLogotype size="sm" />
          <Button isIconOnly size="sm" variant="light" onPress={() => setNavOpen(true)}>
            <Icon path={mdiMenu} size="24px" />
          </Button>
        </section>
        {/* CANVAS */}
        <section className={`${navOpen ? "ml-72 md:-z-50" : "ml-0"} transition-all h-screen`}>
          <div
            className={`${navOpen ? "pt-4" : "pt-[58px]"} p-4 transition-all h-screen bg-background h-full overflow-auto`}
          >
            {children}
          </div>
        </section>
      </main>
    </AuthWrapper>
  )
}
