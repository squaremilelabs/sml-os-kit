import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"
import useAuthState from "@/~sml-os-kit/modules/auth/hooks/useAuthState"
import _createTicket from "@/~sml-os-kit/modules/roadmap/functions/_createTicket"
import createTicket from "@/~sml-os-kit/modules/roadmap/functions/_createTicket"
import { Button, Checkbox, Input } from "@nextui-org/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as Yup from "yup"

type CreateTicketInput = Parameters<typeof createTicket>[0]
export default function NewTicketView() {
  const queryClient = useQueryClient()
  const { user } = useAuthState()
  const formik = useFormik<CreateTicketInput>({
    initialValues: {
      title: "",
      description: "",
      urgent: false,
      creatorEmail: user?.email,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      urgent: Yup.boolean(),
    }),
    onSubmit: (values) => {
      saveMutation.mutate(values)
    },
  })
  const { push } = usePageRouter()

  const handleResetAndClose = () => {
    formik.handleReset(null)
    saveMutation.reset()
    push(null, { tab: "triage" })
  }

  const saveMutation = useMutation({
    mutationFn: async (input: CreateTicketInput) => {
      await _createTicket(input)
      await queryClient.invalidateQueries({ queryKey: ["roadmap", "tickets"] })
      handleResetAndClose()
    },
  })
  const isSaveEnabled = formik.isValid
  return (
    <form onSubmit={isSaveEnabled ? formik.handleSubmit : undefined}>
      <div className="grid grid-rows-4 gap-4">
        <Input
          label="Title"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.title && !!formik.errors.title}
          errorMessage={formik.touched.title ? formik.errors.title : undefined}
        />
        <Input
          label="Description"
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.description && !!formik.errors.description}
          errorMessage={formik.touched.description ? formik.errors.description : undefined}
        />
        <Checkbox
          isSelected={formik.values.urgent}
          onClick={() => {
            formik.setFieldValue("urgent", !formik.values.urgent)
          }}
          name="urgent"
        >
          Urgent
        </Checkbox>
        <Button
          color="primary"
          type="submit"
          isLoading={saveMutation.isPending}
          isDisabled={!isSaveEnabled}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
