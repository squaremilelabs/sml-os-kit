import { SiteConfig } from "@/~sml-os-kit/config/site/types"
import { mdiCogOutline } from "@mdi/js"

export const coreSiteConfig: SiteConfig = {
  console: {
    navigation: [
      {
        type: "group",
        label: "Admin",
        iconPath: mdiCogOutline,
        items: [
          {
            type: "page",
            label: "Manage Users",
            href: "/console/core/users",
          },
          {
            type: "page",
            label: "View API Logs",
            href: "/console/core/api-logs",
          },
        ],
      },
    ],
  },
}
