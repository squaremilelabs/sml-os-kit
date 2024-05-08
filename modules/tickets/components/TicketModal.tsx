import WorkInProcess from "@/~sml-os-kit/common/components/WorkInProcess"
import { Modal, ModalBody, ModalContent } from "@nextui-org/react"

export default function TicketModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        <ModalBody>
          <div className="h-[70vh]">
            <WorkInProcess />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
