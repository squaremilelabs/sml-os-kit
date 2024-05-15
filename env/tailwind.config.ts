import { nextui } from "@nextui-org/react"
import { coreTailwindConfig } from "../config/constants" // cannot use @ import for tailwind config
import { getColorThemes } from "../config/functions" // cannot use @ import for tailwind config

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ...coreTailwindConfig.content,
    // add more here
  ],
  safelist: [
    ...coreTailwindConfig.safelist,
    // add more here
  ],
  theme: {
    ...coreTailwindConfig.theme,
    extend: {
      ...coreTailwindConfig.theme.extend,
    },
    // add more here
  },
  darkMode: coreTailwindConfig.darkMode,
  plugins: [
    nextui({
      addCommonColors: true,
      themes: getColorThemes(),
    }),
  ],
}
