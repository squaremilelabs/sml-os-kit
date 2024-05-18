import { merge } from "ts-deepmerge"
import { nextui } from "@nextui-org/react"
import { coreNextUIPluginConfig, coreTailwindConfig } from "../config/constants" // cannot use @ import for tailwind config

/** @type {import('tailwindcss').Config} */
module.exports = merge(coreTailwindConfig, {
  plugins: [nextui(merge(coreNextUIPluginConfig, {}))],
})
