import { Image } from "@nextui-org/react"

export default function WorkInProcess() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex items-center space-x-2">
        <Image
          src="https://i.ibb.co/W2b0nX9/sml-gold.png"
          className="w-12"
          radius="none"
          alt="Square Mile Labs"
        />
        <h1 className="text-2xl font-medium text-default-500">work in process</h1>
      </div>
    </div>
  )
}
