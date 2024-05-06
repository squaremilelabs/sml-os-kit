"use client"

import { AdminNavItem } from "@/~sml-os-kit/config/types"
import getAdminNavigationForOSUser from "@/~sml-os-kit/modules/auth/functions/getAdminNavigationForOSUser"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import { mdiArrowTopRight, mdiCircleOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Accordion, AccordionItem, Button, ScrollShadow, Spacer } from "@nextui-org/react"
import Link from "next/link"
import useNavState from "../useNavState"
import useScreenSize from "@/~sml-os-kit/common/hooks/useScreenSize"
import useDynamicPathname from "@/~sml-os-kit/common/hooks/useDynamicPathname"

export default function NavItems() {
  const auth = useAuthState()
  if (!auth.user) return <Spacer className="grow" />

  const navigation = getAdminNavigationForOSUser(auth.user)

  return (
    <ScrollShadow hideScrollBar size={100} className="grow flex flex-col px-4 py-1">
      {navigation.map((navItem) => {
        if (navItem.type === "group") {
          return <NavGroup key={navItem.label} navItem={navItem} />
        } else {
          return <NavItem key={navItem.href} navItem={navItem} />
        }
      })}
    </ScrollShadow>
  )
}

function NavGroup({ navItem }: { navItem: AdminNavItem }) {
  const { navOpen, setNavOpen } = useNavState()
  const screenSize = useScreenSize()
  const handlePress = navOpen && screenSize !== "lg" ? () => setNavOpen(false) : undefined
  const dynamicPathname = useDynamicPathname()
  return (
    <Accordion className="p-0 px-0 py-0">
      <AccordionItem
        classNames={{
          title: "text-sm text-foreground data-[open]:text-default-500",
          trigger: "rounded-sm gap-0 text-foreground data-[open]:text-default-500 p-1 h-9",
          startContent: "mr-2",
          content: "pb-2 px-1",
          base: "border-b-1 border-default-200 px-0",
        }}
        key={navItem.href}
        title={navItem.label}
        startContent={<Icon path={navItem.iconPath ?? mdiCircleOutline} className="w-4" />}
        isCompact
      >
        {navItem.items?.map((innerNavItem) => {
          const isActive = dynamicPathname === innerNavItem.href
          return (
            <Button
              as={Link}
              key={innerNavItem.href}
              href={innerNavItem.href}
              className="justify-between rounded-sm h-fit p-1 w-full pl-4 truncate"
              color={isActive ? "primary" : "default"}
              variant="light"
              onPress={handlePress}
            >
              <span className="grow text-left">{innerNavItem.label}</span>
              {innerNavItem.type === "link" ? (
                <Icon path={mdiArrowTopRight} className="w-3" />
              ) : null}
            </Button>
          )
        })}
      </AccordionItem>
    </Accordion>
  )
}

function NavItem({ navItem }: { navItem: AdminNavItem }) {
  const { navOpen, setNavOpen } = useNavState()
  const screenSize = useScreenSize()
  const handlePress = navOpen && screenSize !== "lg" ? () => setNavOpen(false) : undefined
  const dynamicPathname = useDynamicPathname()
  const isActive = dynamicPathname === navItem.href

  return (
    <Button
      as={Link}
      href={navItem.href}
      className="rounded-none gap-0 text-sm justify-start h-9 min-h-9 border-b-1 border-default-200 p-1 truncate"
      color={isActive ? "primary" : "default"}
      variant="light"
      startContent={<Icon path={navItem.iconPath ?? mdiCircleOutline} className="w-4 mr-2" />}
      onPress={handlePress}
    >
      <span className="grow text-left">{navItem.label}</span>
      {navItem.type === "link" ? <Icon path={mdiArrowTopRight} className="w-3" /> : null}
    </Button>
  )
}
