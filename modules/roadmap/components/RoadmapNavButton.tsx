import { Button, Image, useDisclosure } from "@nextui-org/react"
import fetchTickets from "../functions/_fetchTickets"
import fetchPatches from "../functions/_fetchPatches"
import createTicket from "../functions/_createTicket"

export default function RoadmapNavButton() {
  const onClick = async () => {
    const test = await fetchTickets()
    console.log(test)
  }

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
      onClick={onClick}
    >
      <span className="grow text-left">Roadmap</span>
    </Button>
  )
}
