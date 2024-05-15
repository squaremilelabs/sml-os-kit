"use client"

import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js"
import Icon from "@mdi/react"
import { Switch } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { useLayoutEffect, useState } from "react"

export default function ThemeSwitch({
  size = "md",
  withLabel,
}: {
  size?: "sm" | "md" | "lg"
  withLabel?: boolean
}) {
  const { theme, setTheme } = useTheme()
  const [isSelected, setIsSelected] = useState(false) // selected == "dark"

  useLayoutEffect(() => {
    setIsSelected(theme === "dark")
  }, [theme])

  return (
    <Switch
      isSelected={isSelected}
      onValueChange={() => setTheme(theme === "light" ? "dark" : "light")}
      size={size}
      color="default"
      endContent={<Icon path={mdiWeatherSunny} />}
      startContent={<Icon path={mdiWeatherNight} />}
      classNames={{
        wrapper: "rounded-lg group-data-[selected=true]:bg-default-200",
        label: "text-xs",
      }}
    >
      {withLabel ? (theme === "dark" ? "Dark mode" : "Light mode") : ""}
    </Switch>
  )
}
