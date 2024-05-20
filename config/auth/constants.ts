import brandConfig from "@/$sml-os-config/brand"
import { AuthConfig } from "@/~sml-os-kit/config/auth/types"

export const authCookieName = brandConfig.orgSlug + "-os-cookie"
export const authTokenHeaderName = brandConfig.orgSlug + "-os-token"
export const authActorHeaderName = brandConfig.orgSlug + "-os-actor-uid"

export const coreAuthConfig: Partial<AuthConfig> = {
  signInMethods: {
    console: ["signInLink"],
    portal: ["signInLink"],
  },
  roles: {
    console: [
      {
        id: "sml",
        type: "console",
        label: "SML",
        isAdmin: true,
      },
    ],
    portal: [],
  },
}
