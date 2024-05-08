import { Skeleton } from "@nextui-org/react"

export default function RowsSkeleton({ numRows = 10 }: { numRows?: number }) {
  return (
    <div className="grid-cols-1 w-full h-full space-y-2 place-items-stretch place-content-start bg-background p-4">
      {Array.from(Array(numRows).keys()).map((key) => {
        return <Skeleton key={key} className="flex rounded-md w-full h-10 bg-content2" />
      })}
    </div>
  )
}
