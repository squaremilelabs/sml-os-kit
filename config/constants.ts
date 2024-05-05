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
            type: "link",
            label: "View API Logs",
            href: "/admin/os/logs",
          },
          {
            type: "page",
            label: "Run Automations",
            href: "/admin/os/automations",
          },
        ],
      },
    ],
  },
}

export const cookieNameSuffix: string = "os-cookie"
export const tokenNameSuffix: string = "os-token"
export const agentNameSuffix: string = "os-agent-uid"
