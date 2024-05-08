import { validateEmail } from "@/~sml-os-kit/common/functions/validators"
import { Button, Input } from "@nextui-org/react"
import { FormEvent, useState } from "react"
import _sendSignInLink from "../../functions/_sendSignInLink"
import Icon from "@mdi/react"
import { mdiCheckCircleOutline } from "@mdi/js"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"

export default function LoginForm() {
  const [email, setEmail] = useState("")

  const isDisabled = !email || !validateEmail(email)

  const mutation = useMutation({
    mutationKey: [email],
    mutationFn: async () => _sendSignInLink(email),
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <form
      className="flex flex-col items-stretch space-y-4 p-8 bg-content2 rounded-lg shadow w-full md:w-96"
      onSubmit={handleSubmit}
    >
      {mutation.isSuccess ? (
        <>
          <div className="flex flex-row items-center self-center space-x-1 text-primary">
            <h1 className="font-semibold text-lg">Sent!</h1>
            <Icon path={mdiCheckCircleOutline} className="w-6" />
          </div>
          <p className="text-center">A sign-in link was sent to {email}</p>
          <Button onPress={mutation.reset} className="self-center px-1 py-1 h-fit" variant="flat">
            Resend
          </Button>
          {/* TODO: remove demo flow */}
          {/* {mutation.data ? (
            <Button
              as={Link}
              href={mutation.data}
              className="self-center px-1 py-1 h-fit"
              variant="light"
              radius="none"
            >
              Proceed with Demo
            </Button>
          ) : null} */}
        </>
      ) : (
        <>
          <Input
            type="email"
            label="Email"
            variant="bordered"
            value={email}
            onValueChange={(value) => setEmail(value)}
            isInvalid={mutation.isError}
            errorMessage={mutation.error ? "Email not recognized" : null}
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
