import AdminUser from "@/~sml-os-kit/app-core/admin/layout/parts/AdminUser"
import useNavState from "@/~sml-os-kit/app-core/admin/layout/parts/useNavState"
import ThemeSwitch from "@/~sml-os-kit/common/components/ThemeSwitch"
import useScreenSize from "@/~sml-os-kit/common/hooks/useScreenSize"
import RoadmapNavButton from "@/~sml-os-kit/modules/roadmap/components/RoadmapNavButton"
import { useState } from "react"

export default function NavFooter() {
  const { navOpen, setNavOpen } = useNavState()
  const screenSize = useScreenSize()
  const handlePress = navOpen && screenSize !== "lg" ? () => setNavOpen(false) : undefined

  return (
    <div className="flex flex-col space-y-2 h-fit px-4 items-stretch">
      <AdminUser />
      <div className="flex flex-row items-stretch">
        <ThemeSwitch />
        <RoadmapNavButton href={"/admin/os/roadmap"} onPress={handlePress} />
      </div>
    </div>
  )
}
