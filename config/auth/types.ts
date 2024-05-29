import { PortalId } from "@/$sml-os-config/site"

/**
 * If changing the Role type, make sure to also update the core.zmodel AuthRole model
 * - E
 */

export interface AuthConfig {
  roles: {
    console: ConsoleRole[]
    portal?: PortalRole[]
  }
}

export interface BaseRole {
  id: string
  type: "console" | "portal"
  label: string
}

export interface ConsoleRole extends BaseRole {
  type: "console"
  isAdmin: boolean
  restrictedConsolePages?: string[]
  accessiblePortalIds?: string[]
}

export interface PortalRole extends BaseRole {
  type: "portal"
  portalId: PortalId
}

export type Role = ConsoleRole | PortalRole
