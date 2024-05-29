import { getColorThemes } from "./functions"
import { NextUIPluginConfig } from "@nextui-org/react"
import tailwindContainerQueryPlugin from "@tailwindcss/container-queries"
import { Config } from "tailwindcss"

export const coreTailwindConfig: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./~sml-os-kit/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuschia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /(w|max-w|min-w)-(oxs|osm|omd|olg|oxl)/,
    },
  ],
  theme: {
    containers: {
      oxs: "288px",
      osm: "576px",
      omd: "864px",
      olg: "1152px",
      oxl: "1440px",
    },
    extend: {
      spacing: {
        oxs: "288px",
        osm: "576px",
        omd: "864px",
        olg: "1152px",
        oxl: "1440px",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      transitionProperty: {
        layout:
          "height, width, max-height, max-width, min-height, min-width, padding, margin, flex, flex-direction, flex-grow",
      },
    },
  },
  darkMode: "class",
  plugins: [tailwindContainerQueryPlugin],
}

export const coreNextUIPluginConfig: NextUIPluginConfig = {
  addCommonColors: true,
  themes: getColorThemes(),
}
