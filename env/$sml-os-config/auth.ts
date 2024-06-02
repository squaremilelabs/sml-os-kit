import { coreAuthConfig } from "@/~sml-os-kit/config/auth/constants"
import { AuthConfig } from "@/~sml-os-kit/config/auth/types"
import { merge } from "ts-deepmerge"

const customAuthConfig: AuthConfig = {
  roles: {
    console: [
      // Demo Role -------------
      // TODO: Remove this role after demo stage
      {
        id: "demo",
        label: "Demo",
        type: "console",
        isAdmin: true,
        restrictedConsolePages: ["/console/core/users", "/console/core/api-logs"],
      },
      // -----------------------
      {
        id: "admin",
        label: "Admin",
        type: "console",
        isAdmin: true,
      },
    ],
  },
}

const authConfig = merge(customAuthConfig, coreAuthConfig)

export default authConfig
