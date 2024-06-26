import _runSafeServerAction from "@/~sml-os-kit/common/functions/_runSafeServerAction"
import useAuthState from "@/~sml-os-kit/auth/hooks/useAuthState"
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
  onAfterSubmit: () => void
}) {
  const auth = useAuthState()

  const formik = useFormik<CreateTicketInput>({
    initialValues: {
      title: "",
      description: "",
      urgent: false,
      submitter: auth?.user?.email ?? null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().max(240, "Too long!"),
      urgent: Yup.boolean(),
      submitter: Yup.string().required(),
    }),
    enableReinitialize: true,
    onSubmit: (values: CreateTicketInput) => {
      saveMutation.mutate(values)
    },
  })

  const saveMutation = useMutation({
    mutationKey: ["ticket", formik.values],
    mutationFn: async (values: CreateTicketInput) => {
      const response = await _runSafeServerAction(_createTicket, values)
      if (response.type === "error") throw response.result
      return response.result
    },
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
                isInvalid={!!formik.errors.title && formik.touched.title}
                errorMessage={formik.errors.title}
                isRequired
              />
              <Textarea
                label="Description"
                {...formik.getFieldProps("description")}
                isInvalid={!!formik.errors.description && formik.touched.description}
                errorMessage={formik.errors.description}
              />
              <Checkbox
                color="danger"
                isSelected={formik.values.urgent}
                {...formik.getFieldProps("urgent")}
                classNames={{
                  base: "flex data-[selected=true]:bg-danger-500 rounded-full transition-all px-4 m-0 border border-default-200 data-[selected=true]:border-danger-500",
                  label: twMerge(
                    "text-sm",
                    formik.values.urgent ? "text-white" : "text-default-500"
                  ),
                }}
              >
                Urgent
              </Checkbox>
            </ModalBody>
            <ModalFooter className="flex items-center justify-between">
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
