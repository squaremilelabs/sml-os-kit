import modulesConfig from "@/$sml-os-config/modules"
import { Button, Image } from "@nextui-org/react"
import Link from "next/link"

export default function RoadmapNavButton({
  onPress,
  href,
}: {
  onPress?: () => any
  href?: string
}) {
  const isEnabled = modulesConfig.roadmap?.enabled
  return (
    <Button
      as={href ? Link : "button"}
      href={href}
      onPress={onPress}
      size="sm"
      radius="sm"
      variant="flat"
      className={"grow justify-start"}
      isDisabled={!isEnabled}
      startContent={
        <Image
          src="https://i.ibb.co/W2b0nX9/sml-gold.png"
          alt="Square Mile Labs"
          className="w-4"
          radius="none"
        />
      }
    >
      <span className="grow text-left">Roadmap</span>
    </Button>
  )
}
