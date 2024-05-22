"use client"

import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
import { mdiArrowTopRight, mdiCircleOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Accordion, AccordionItem, Button, ScrollShadow, Spacer } from "@nextui-org/react"
import Link from "next/link"
import useNavState from "../useNavState"
import { twMerge } from "tailwind-merge"
import { usePathname } from "next/navigation"
import { NavGroup as INavGroup, NavPageOrLink } from "@/~sml-os-kit/config/site/types"
import getNavItems from "@/~sml-os-kit/app-core/shared-layout/parts/NavItems/getNavItems"
import useScreenBreakpoint from "@/~sml-os-kit/common/hooks/useScreenBreakpoint"

export default function NavItems() {
  const auth = useAuthState()
  const pathname = usePathname()
  if (!auth.user) return <Spacer className="grow" />

  const navItems = getNavItems(auth.user, pathname)

  return (
    <ScrollShadow hideScrollBar size={100} className="flex grow flex-col px-4 py-1">
      {navItems.map((navItem) => {
        if (navItem.type === "group") {
          return <NavGroup key={navItem.label} navItem={navItem} />
        } else {
          return <NavItem key={navItem.href} navItem={navItem} />
        }
      })}
    </ScrollShadow>
  )
}

function NavGroup({ navItem }: { navItem: INavGroup }) {
  const { navOpen, setNavOpen } = useNavState()
  const breakpoint = useScreenBreakpoint()
  const handlePress = navOpen && breakpoint < 3 ? () => setNavOpen(false) : undefined
  const pathname = usePathname()
  const hasActiveItem = navItem?.items?.some((item) => item.href === pathname)
  return (
    <Accordion
      className="p-0 px-0 py-0"
      defaultExpandedKeys={hasActiveItem ? [navItem.label] : undefined}
    >
      <AccordionItem
        classNames={{
          title: "text-sm text-inherit",
          trigger: twMerge(
            hasActiveItem ? "text-primary-600 font-semibold" : null,
            "data-[open]:text-default-500 data-[open]:font-normal",
            "rounded-sm gap-0 p-1 h-9"
          ),
          startContent: "mr-2",
          content: "pb-2 px-1",
          base: "border-b-1 border-default-200 px-0",
        }}
        key={navItem.label}
        title={navItem.label}
        startContent={<Icon path={navItem.iconPath ?? mdiCircleOutline} className="w-4" />}
        isCompact
      >
        {navItem.items?.map((innerNavItem) => {
          const isActive = pathname === innerNavItem.href
          return (
            <Button
              as={Link}
              key={innerNavItem.href}
              href={innerNavItem.href}
              className={twMerge(
                "h-fit w-full justify-between truncate rounded-sm p-1 pl-4",
                isActive ? "font-semibold text-primary-600" : null
              )}
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

function NavItem({ navItem }: { navItem: NavPageOrLink }) {
  const { navOpen, setNavOpen } = useNavState()
  const breakpoint = useScreenBreakpoint()
  const handlePress = navOpen && breakpoint < 3 ? () => setNavOpen(false) : undefined
  const pathname = usePathname()
  const isActive = pathname === navItem.href

  return (
    <Button
      as={Link}
      href={navItem.href}
      className={twMerge(
        "h-9 min-h-9 justify-start gap-0 truncate rounded-none border-b-1 border-default-200 p-1 text-sm",
        isActive ? "font-semibold text-primary-600" : null
      )}
      variant="light"
      startContent={<Icon path={navItem.iconPath ?? mdiCircleOutline} className="mr-2 w-4" />}
      onPress={handlePress}
    >
      <span className="grow text-left">{navItem.label}</span>
      {navItem.type === "link" ? <Icon path={mdiArrowTopRight} className="w-3" /> : null}
    </Button>
  )
}
