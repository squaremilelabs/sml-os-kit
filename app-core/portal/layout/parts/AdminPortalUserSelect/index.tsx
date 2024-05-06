import usePortalAgent from "@/~sml-os-kit/modules/portal-agent/usePortalAgent"
import { Input } from "@nextui-org/react"
import { useMutation } from "@tanstack/react-query"
import { FormEvent, useEffect, useState } from "react"

export default function AdminPortalUserInputForm() {
  const { portalConfig, setPortalUserByEmail } = usePortalAgent()
  const [email, setEmail] = useState("")
  const mutation = useMutation({
    mutationKey: [email],
    mutationFn: async (email: string) => setPortalUserByEmail(email),
  })

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    mutation.mutate(email)
  }

  useEffect(() => {
    if (mutation.isError && !email) {
      mutation.reset()
    }
  }, [email, mutation])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-80 items-center">
      <h1 className="font-semibold">Admin Login</h1>
      <Input
        type="email"
        label="Email"
        value={email}
        onValueChange={setEmail}
        description={`Enter a valid user's email to interact with the ${portalConfig?.title} as them.`}
        onClear={mutation.isError ? mutation.reset : undefined}
        isInvalid={mutation.isError}
        errorMessage={mutation.error?.message}
      />
    </form>
  )
}
