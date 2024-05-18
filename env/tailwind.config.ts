import { merge } from "ts-deepmerge"
import { nextui } from "@nextui-org/react"
import { coreTailwindConfig } from "../config/constants" // cannot use @ import for tailwind config
import { getColorThemes } from "../config/functions" // cannot use @ import for tailwind config

/** @type {import('tailwindcss').Config} */
module.exports = merge(coreTailwindConfig, {
  plugins: [
    nextui({
      addCommonColors: true,
      themes: getColorThemes(),
    }),
  ],
})
