export interface BrandConfig {
  appName: string // e.g., "culinistasOS"
  orgName: string // e.g., "The Culinistas"
  orgNamePossesive: string // e.g., "The Culinistas'"
  orgTicker: string // e.g., "CUL"
  orgSlug: string // e.g., "culinistas"
  assetPaths: {
    // Values should be paths in public/ folder
    logoOnLight: string // e.g. "/cul-light-blue-logo.png"
    logoOnDark: string
    [customKey: string]: string // optional additional assets
  }
  colors: {
    [colorKey: string]: string
  }
}

export interface SiteConfig {
  public?: {
    pathnames: string[]
  }
  admin: AdminConfig
  portals?: PortalConfig[]
}

export interface AdminConfig {
  navigation: AdminNavItem[]
}

export interface AdminNavItem {
  type: "group" | "page" | "link"
  label: string
  href?: string
  items?: AdminNavItem[]
  iconPath?: string
}

export interface PortalConfig {
  id: string
  title: string
  basePath: string
}

export interface ModulesConfig {
  roadmap: {
    enabled: boolean
    notion: {
      ticketsDatabaseId: string
      patchesDatabaseId: string
      featuresDatabaseId: string
    }
  }
}
