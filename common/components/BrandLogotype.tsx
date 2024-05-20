import brandConfig from "@/$sml-os-config/brand"
import BrandLogo from "@/~sml-os-kit/common/components/BrandLogo"

export default function BrandLogotype({
  size = "md",
  title,
}: {
  size?: "sm" | "md" | "lg"
  title?: string
}) {
  const logoWidth = size === "sm" ? 20 : size === "lg" ? 30 : 24
  const textSize = size === "sm" ? "text-md" : size === "lg" ? "text-2xl" : "text-lg"
  return (
    <div className="flex flex-row items-center space-x-1">
      <BrandLogo width={logoWidth} />
      <h3 className={`grow font-semibold ${textSize}`}>{title ?? brandConfig?.appName}</h3>
    </div>
  )
}
