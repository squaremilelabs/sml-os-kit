import { useMediaQuery } from "usehooks-ts"

export default function useScreenSize(): "sm" | "md" | "lg" {
  const medium = useMediaQuery("(min-width: 640px)")
  const large = useMediaQuery("(min-width: 768px)")

  if (large) return "lg"
  if (medium) return "md"
  return "sm"
}
