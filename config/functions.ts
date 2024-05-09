import siteConfig from "../../$sml-os-config/site" // cannot use @ import for tailwind config
import brandConfig from "../../$sml-os-config/brand" // cannot use @ import for tailwind config
import { agentNameSuffix, cookieNameSuffix, coreSiteConfig, tokenNameSuffix } from "./constants"
import { SiteConfig } from "./types"
import { NextUIPluginConfig } from "@nextui-org/react"

export function getSiteConfig(): SiteConfig {
  return {
    public: {
      pathnames: [
        ...(coreSiteConfig.public?.pathnames ?? []),
        ...(siteConfig.public?.pathnames ?? []),
      ],
    },
    admin: {
      navigation: [
        ...(siteConfig.admin?.navigation ?? []),
        ...(coreSiteConfig.admin?.navigation ?? []),
      ],
    },
    portals: siteConfig.portals,
    roadmap: siteConfig.roadmap,
  }
}

export function getNextUIPluginConfig(): NextUIPluginConfig {
  const brandColors = brandConfig.colors

  const lightColorMap = {
    "50": "100",
    "100": "100",
    "200": "200",
    "300": "300",
    "400": "400",
    "500": "500",
    "600": "600",
    "700": "700",
    "800": "800",
    "900": "900",
  }

  const darkColorMap = {
    "50": "900",
    "100": "900",
    "200": "800",
    "300": "700",
    "400": "600",
    "500": "500",
    "600": "400",
    "700": "300",
    "800": "200",
    "900": "100",
  }

  const constructColorConfig = (colorKey: string, theme: "light" | "dark") => {
    const targetColorMap: { [scale: string]: string } = Object.entries(brandColors)
      .filter(([key]) => key.startsWith(`color-${colorKey}-`))
      .reduce((prev, [key, value]) => {
        const [_, __, scale] = key.split("-")
        return { ...prev, [scale]: value }
      }, {})

    if (Object.entries(targetColorMap).length === 0) return undefined

    const themeMap = theme === "light" ? lightColorMap : darkColorMap

    const scaledColors: { [scale: string]: string } = Object.entries(themeMap).reduce(
      (prev, [key, value]) => {
        const colorValue = targetColorMap[value]
        return { ...prev, [key]: colorValue }
      },
      {}
    )

    return {
      DEFAULT: scaledColors["500"],
      ...scaledColors,
    }
  }

  return {
    themes: {
      light: {
        colors: {
          focus: brandColors["color-primary-600"],
          primary: constructColorConfig("primary", "light"),
          success: constructColorConfig("success", "light"),
          warning: constructColorConfig("warning", "light"),
          danger: constructColorConfig("danger", "light"),
        },
      },
      dark: {
        colors: {
          focus: brandColors["color-primary-200"],
          primary: constructColorConfig("primary", "dark"),
          success: constructColorConfig("success", "dark"),
          warning: constructColorConfig("warning", "dark"),
          danger: constructColorConfig("danger", "dark"),
        },
      },
    },
  }
}

export function getCookieName() {
  return brandConfig.orgSlug + "-" + cookieNameSuffix
}

export function getTokenName() {
  return brandConfig.orgSlug + "-" + tokenNameSuffix
}

export function getAgentName() {
  return brandConfig.orgSlug + "-" + agentNameSuffix
}
