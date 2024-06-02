import createMap from "@/~sml-os-kit/common/functions/createMap"
import { coreSiteConfig } from "@/~sml-os-kit/config/site/constants"
import { PortalConfig, SiteConfig } from "@/~sml-os-kit/config/site/types"
import { merge } from "ts-deepmerge"

export type PortalId = never

const customSiteConfig: SiteConfig = {
  console: {
    navigation: [],
  },
  portals: createMap<PortalId, PortalConfig>({}),
}

const siteConfig = merge(customSiteConfig, coreSiteConfig)

export default siteConfig
