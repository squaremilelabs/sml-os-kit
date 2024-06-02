"use client"

import { mdiLaptop, mdiWeatherNight, mdiWeatherSunny } from "@mdi/js"
import Icon from "@mdi/react"
import { Button, ButtonGroup } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { twMerge } from "tailwind-merge"

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const baseClassName = "h-fit min-h-0 w-fit min-w-0 p-2 bg-content3 text-default-800"
  const selectedClassName = "bg-content4"

  return (
    <>
      <ButtonGroup>
        <Button
          isIconOnly
          className={twMerge(baseClassName, theme === "light" ? selectedClassName : null)}
          onPress={() => setTheme("light")}
        >
          <Icon path={mdiWeatherSunny} className="w-4" />
        </Button>
        <Button
          isIconOnly
          className={twMerge(baseClassName, theme === "dark" ? selectedClassName : null)}
          onPress={() => setTheme("dark")}
        >
          <Icon path={mdiWeatherNight} className="w-4" />
        </Button>
        <Button
          isIconOnly
          className={twMerge(baseClassName, theme === "system" ? selectedClassName : null)}
          onPress={() => setTheme("system")}
        >
          <Icon path={mdiLaptop} className="w-4" />
        </Button>
      </ButtonGroup>
    </>
  )
}
