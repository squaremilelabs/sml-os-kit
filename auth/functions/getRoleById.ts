import authConfig from "@/$sml-os-config/auth"
import { Role } from "@/~sml-os-kit/config/auth/types"

export default function getRoleById(roleId: string): Role | null {
  const consoleRole = authConfig.roles.console.find((role) => role.id === roleId)
  const portalRole = authConfig.roles.portal.find((role) => role.id === roleId)
  return consoleRole ?? portalRole ?? null
}
