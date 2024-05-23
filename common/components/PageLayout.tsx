import React from "react"
import { twMerge } from "tailwind-merge"

export default function PageLayout({
  width,
  children,
}: {
  width: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}) {
  return (
    <div className="grid h-full max-h-full w-full max-w-full grid-rows-1 overflow-auto">
      <div
        className={twMerge(
          "flex h-full max-w-full flex-col place-self-center self-start",
          width === "sm"
            ? "w-pagesm"
            : width === "md"
              ? "w-pagemd"
              : width === "lg"
                ? "w-pagelg"
                : width === "xl"
                  ? "w-pagexl"
                  : undefined
        )}
      >
        {children}
      </div>
    </div>
  )
}
