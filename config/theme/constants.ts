import { getColorThemes } from "./functions"
import { NextUIPluginConfig } from "@nextui-org/react"
import plugin from "tailwindcss/plugin"

export const coreTailwindConfig = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./~sml-os-kit/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern:
        /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuschia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern:
        /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuschia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern:
        /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuschia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      height: {
        screen: ["100vh", "100dvh"],
      },
      transitionProperty: {
        layout:
          "height, width, max-height, max-width, min-height, min-width, padding, margin, flex, flex-direction, flex-grow",
      },
      screens: {
        sm: "var(--os-breakpoint-sm)",
        md: "var(--os-breakpoint-md)",
        lg: "var(--os-breakpoint-lg)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        "@screen sm": {
          "max-width": "var(--os-breakpoint-sm)",
        },
        "@screen md": {
          "max-width": "var(--os-breakpoint-md)",
        },
        "@screen lg": {
          "max-width": "var(--os-breakpoint-lg)",
        },
      })
    }),
  ],
}

export const coreNextUIPluginConfig: NextUIPluginConfig = {
  addCommonColors: true,
  themes: getColorThemes(),
}
