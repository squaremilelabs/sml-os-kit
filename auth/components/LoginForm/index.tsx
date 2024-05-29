import { Button, Input } from "@nextui-org/react"
import { FormEvent, useState } from "react"
import _sendSignInLink from "../../functions/_sendSignInLink"
import Icon from "@mdi/react"
import { mdiCheckCircleOutline } from "@mdi/js"
import { useMutation } from "@tanstack/react-query"
import _runSafeServerAction from "@/~sml-os-kit/common/functions/_runSafeServerAction"
import _clearSessionCookie from "@/~sml-os-kit/auth/functions/_clearSessionCookie"

export default function LoginForm() {
  const [email, setEmail] = useState("")

  const isDisabled = !email

  const mutation = useMutation({
    mutationKey: [email],
    mutationFn: async () => {
      const response = await _runSafeServerAction(_sendSignInLink, email)
      if (response.type === "error") throw response.result
      return response.result
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <form
      className="flex w-full flex-col items-stretch space-y-4 rounded-lg border border-default-200 p-8 md:w-96"
      onSubmit={handleSubmit}
    >
      {mutation.isSuccess ? (
        <>
          <div className="flex flex-row items-center space-x-1 self-center text-primary">
            <h1 className="text-lg font-semibold">Sent!</h1>
            <Icon path={mdiCheckCircleOutline} className="w-6" />
          </div>
          <p className="text-center">A sign-in link was sent to {email}</p>
          <Button onPress={mutation.reset} className="h-fit self-center px-1 py-1" variant="flat">
            Resend
          </Button>
        </>
      ) : (
        <>
          <Input
            type="email"
            label="Email"
            value={email}
            onValueChange={(value) => setEmail(value)}
            isInvalid={mutation.isError}
            errorMessage={mutation.error?.message ?? undefined}
          />
          <Button
            color="primary"
            isDisabled={isDisabled}
            isLoading={mutation.isPending}
            type="submit"
          >
            Send Sign-in Link
          </Button>
        </>
      )}
    </form>
  )
}
