import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import _createTicket from "@/~sml-os-kit/modules/roadmap/functions/_createTicket"
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"
import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import { twMerge } from "tailwind-merge"
import * as Yup from "yup"

type CreateTicketInput = Parameters<typeof _createTicket>[0]

export default function NewTicketModal({
  isOpen,
  onClose,
  onAfterSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onAfterSubmit: () => any
}) {
  const auth = useAuthState()

  const formik = useFormik<CreateTicketInput>({
    initialValues: {
      title: "",
      description: "",
      urgent: false,
      creatorEmail: auth?.user?.email ?? "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().max(240, "Too long!"),
      urgent: Yup.boolean(),
      creatorEmail: Yup.string().required(),
    }),
    enableReinitialize: true,
    onSubmit: (values: CreateTicketInput) => {
      saveMutation.mutate(values)
    },
  })

  const saveMutation = useMutation({
    mutationKey: ["ticket", formik.values],
    mutationFn: async (values: CreateTicketInput) => _createTicket(values),
    onSuccess: () => {
      onAfterSubmit()
      formik.handleReset(null)
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
      <ModalContent>
        {() => (
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>New Ticket</ModalHeader>
            <ModalBody className="flex flex-col space-y-2">
              <Input
                label="Title"
                {...formik.getFieldProps("title")}
                isInvalid={!!formik.errors.title}
                errorMessage={formik.errors.title}
                isRequired
              />
              <Textarea
                label="Description"
                {...formik.getFieldProps("description")}
                isInvalid={!!formik.errors.description}
                errorMessage={formik.errors.description}
              />
              <Checkbox
                color="danger"
                isSelected={formik.values.urgent}
                {...formik.getFieldProps("urgent")}
                classNames={{
                  base: "flex data-[selected=true]:bg-danger-500 rounded-full transition-all px-4 m-0 border border-default-200 data-[selected=true]:border-0",
                  label: twMerge(
                    "text-sm",
                    formik.values.urgent ? "text-white" : "text-default-500"
                  ),
                }}
              >
                Urgent
              </Checkbox>
            </ModalBody>
            <ModalFooter className="flex justify-between items-center">
              {saveMutation.isError ? (
                <p className="text-sm text-danger">{saveMutation.error.message}</p>
              ) : (
                <div />
              )}
              <Button
                color="primary"
                type="submit"
                isLoading={saveMutation.isPending}
                isDisabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
              >
                Add Ticket
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
