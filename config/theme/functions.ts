import brandConfig from "../../../$sml-os-config/brand" // cannot use @ import
import { ConfigTheme } from "@nextui-org/react"

export function getColorThemes(): { light: ConfigTheme; dark: ConfigTheme } {
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

  const constructBrandColorConfig = (colorKey: string, theme: "light" | "dark") => {
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
    light: {
      colors: {
        focus: brandColors["color-primary-600"],
        primary: constructBrandColorConfig("primary", "light"),
        success: constructBrandColorConfig("success", "light"),
        warning: constructBrandColorConfig("warning", "light"),
        danger: constructBrandColorConfig("danger", "light"),
      },
    },
    dark: {
      colors: {
        focus: brandColors["color-primary-400"],
        primary: constructBrandColorConfig("primary", "dark"),
        success: constructBrandColorConfig("success", "dark"),
        warning: constructBrandColorConfig("warning", "dark"),
        danger: constructBrandColorConfig("danger", "dark"),
      },
    },
  }
}
