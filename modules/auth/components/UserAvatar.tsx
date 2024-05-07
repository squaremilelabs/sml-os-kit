import { Avatar, AvatarProps } from "@nextui-org/avatar"
import { Tooltip, TooltipProps } from "@nextui-org/tooltip"
import { OSUser } from "../types"
import Icon from "@mdi/react"
import { mdiAccountOutline } from "@mdi/js"

export default function UserAvatar({
  user,
  tooltipPlacement = "left",
  disableTooltip,
  size = "sm",
  ...avatarProps
}: {
  user: Partial<OSUser> | undefined | null
  tooltipPlacement?: TooltipProps["placement"]
  disableTooltip?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl"
} & Omit<AvatarProps, "name" | "src" | "getInitials" | "fallback" | "size">) {
  const isNativeSize = ["sm", "md", "lg"].includes(size)
  const xsClassName = "w-6 h-6 text-tiny"
  const xlClassName = "w-20 h-20 text-xl"

  return (
    <Tooltip
      content={user?.email ?? "Unknown user"}
      isDisabled={disableTooltip}
      placement={tooltipPlacement}
    >
      <Avatar
        name={user?.displayName}
        src={user?.photoUrl}
        size={isNativeSize ? (size as AvatarProps["size"]) : undefined}
        className={
          !isNativeSize
            ? size === "xs"
              ? xsClassName
              : size === "xl"
                ? xlClassName
                : undefined
            : undefined
        }
        fallback={
          user?.displayName ? (
            user.displayName[0]
          ) : (
            <Icon path={mdiAccountOutline} className="w-full h-full" />
          )
        }
        {...avatarProps}
      />
    </Tooltip>
  )
}
