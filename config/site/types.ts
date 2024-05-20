import { PortalId } from "@/$sml-os-config/site"

export interface SiteConfig {
  console: ConsoleConfig
  portals?: Map<PortalId, PortalConfig>
}

export interface ConsoleConfig {
  navigation: NavItem[]
}

export interface PortalConfig {
  id: PortalId
  title: string
  basePath: string
  navigation: NavItem[]
}

export interface BaseNavItem {
  type: "group" | "page" | "link"
  label: string
  iconPath: string
}

export interface NavPageOrLink extends BaseNavItem {
  type: "page" | "link"
  href: string
}

export interface NavGroup extends BaseNavItem {
  type: "group"
  items: Array<Omit<NavPageOrLink, "iconPath"> & { iconPath?: string }>
}

export type NavItem = NavGroup | NavPageOrLink
