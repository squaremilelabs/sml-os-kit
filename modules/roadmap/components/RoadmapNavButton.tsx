import { Button, Image, useDisclosure } from "@nextui-org/react"
import Link from "next/link"

export default function RoadmapNavButton() {
  return (
    <Button
      as={Link}
      href="/admin/os/roadmap"
      size="sm"
      radius="sm"
      variant="flat"
      className={"justify-start grow"}
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
