import { useMediaQuery } from "usehooks-ts"
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "@/tailwind.config"

const fullConfig = resolveConfig(tailwindConfig)

export default function useScreenBreakpoint(): 1 | 2 | 3 | 4 | 5 {
  const xxlarge = useMediaQuery(`(min-width: ${fullConfig.theme.screens["2xl"]})`)
  const xlarge = useMediaQuery(`(min-width: ${fullConfig.theme.screens["xl"]})`)
  const large = useMediaQuery(`(min-width: ${fullConfig.theme.screens["lg"]})`)
  const medium = useMediaQuery(`(min-width: ${fullConfig.theme.screens["md"]})`)

  if (xxlarge) return 5
  if (xlarge) return 4
  if (large) return 3
  if (medium) return 2
  return 1
}
