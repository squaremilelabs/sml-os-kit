import { Avatar, AvatarProps } from "@nextui-org/avatar"
import { Tooltip, TooltipProps } from "@nextui-org/tooltip"
import { OSUser } from "../types"

export default function UserAvatar({
  user,
  tooltipPlacement = "left",
  disableTooltip,
  ...avatarProps
}: {
  user: OSUser | undefined | null
  tooltipPlacement?: TooltipProps["placement"]
  disableTooltip?: boolean
} & Omit<AvatarProps, "name" | "src" | "getInitials">) {
  return (
    <Tooltip
      content={user?.email ?? "Unknown user"}
      isDisabled={disableTooltip}
      placement={tooltipPlacement}
    >
      <Avatar
        name={user?.displayName}
        src={user?.photoUrl}
        getInitials={(val) => val[0]}
        showFallback
        {...avatarProps}
      />
    </Tooltip>
  )
}
