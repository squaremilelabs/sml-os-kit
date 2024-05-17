import { mdiCogOutline } from "@mdi/js"
import { SiteConfig } from "./types"

export const coreSiteConfig: Partial<SiteConfig> = {
  admin: {
    navigation: [
      {
        type: "group",
        label: "OS Admin",
        iconPath: mdiCogOutline,
        items: [
          {
            type: "page",
            label: "Manage Users",
            href: "/admin/os/users",
          },
          {
            type: "page",
            label: "View API Logs",
            href: "/admin/os/api-logs",
          },
        ],
      },
    ],
  },
}

export const cookieNameSuffix: string = "os-cookie"
export const tokenNameSuffix: string = "os-token"
export const agentNameSuffix: string = "os-agent-uid"

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
        screen: ["100dvh", "100vh"],
      },
      transitionProperty: {
        layout:
          "height, width, max-height, max-width, min-height, min-width, padding, margin, flex, flex-direction, flex-grow",
      },
    },
  },
  darkMode: "class",
}
