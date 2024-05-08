import { Image } from "@nextui-org/react"

export default function ComingSoon() {
  return (
    <div className="flex flex-col space-y-2 items-center justify-center h-full w-full">
      <Image
        src="https://i.ibb.co/W2b0nX9/sml-gold.png"
        className="w-24"
        radius="none"
        alt="Square Mile Labs"
      />
      <h1 className="text-2xl font-medium text-default-500">Coming Soon</h1>
    </div>
  )
}
