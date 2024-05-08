import { mdiArrowTopRight, mdiOpenInApp } from "@mdi/js"
import Icon from "@mdi/react"
import { Button, Image, useDisclosure } from "@nextui-org/react"
import { twMerge } from "tailwind-merge"
import TicketModal from "./TicketModal"

export default function TicketButton({ className }: { className?: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button
        size="sm"
        radius="sm"
        variant="flat"
        className={twMerge("justify-between", className)}
        disableRipple
        startContent={
          <Image
            src="https://i.ibb.co/W2b0nX9/sml-gold.png"
            alt="Square Mile Labs"
            className="w-4"
            radius="none"
          />
        }
        endContent={<Icon path={mdiArrowTopRight} className="w-4 text-default-500" />}
        onPress={onOpen}
      >
        <span className="grow text-left">SML Tickets</span>
      </Button>
      <TicketModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
