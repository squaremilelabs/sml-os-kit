import brandConfig from "@/$sml-os-config/brand"
import { Image, ImageProps } from "@nextui-org/react"
import { useTheme } from "next-themes"

export default function BrandLogo(imageProps: Omit<ImageProps, "src" | "alt">) {
  const { theme } = useTheme()
  const imageSrc =
    theme === "light" ? brandConfig?.assetPaths?.logoOnLight : brandConfig?.assetPaths?.logoOnDark
  const imageAlt = brandConfig?.orgSlug
  return <Image src={imageSrc} alt={imageAlt} {...imageProps} />
}
