import { merge } from "ts-deepmerge"
import { nextui } from "@nextui-org/react"
// TODO: change @/ to ./ after copying
import { coreNextUIPluginConfig, coreTailwindConfig } from "@/~sml-os-kit/config/theme/constants" // cannot use @ import for tailwind config
import { Config } from "tailwindcss"

export default merge(coreTailwindConfig, {
  plugins: [nextui(merge(coreNextUIPluginConfig, {}))],
}) as Config
