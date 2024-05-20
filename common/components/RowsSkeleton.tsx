import { Skeleton } from "@nextui-org/react"

export default function RowsSkeleton({ numRows = 10 }: { numRows?: number }) {
  return (
    <div className="h-full w-full grid-cols-1 place-content-start place-items-stretch space-y-2 bg-background p-4">
      {Array.from(Array(numRows).keys()).map((key) => {
        return <Skeleton key={key} className="flex h-10 w-full rounded-md bg-content2" />
      })}
    </div>
  )
}
