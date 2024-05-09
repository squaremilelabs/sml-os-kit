import { Button, Image, useDisclosure } from "@nextui-org/react"

export default function RoadmapNavButton() {
  return (
    <Button
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
