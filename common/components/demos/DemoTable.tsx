import { mdiFilterVariant, mdiMagnify, mdiPlus, mdiTableCog, mdiTrayArrowDown } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Button,
  ButtonProps,
  Chip,
  ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Pagination,
  TableProps,
} from "@nextui-org/react"
import { createId } from "@paralleldrive/cuid2"
import { twMerge } from "tailwind-merge"

export interface DemoTableColumn {
  key: string
  label: string
  type: "span" | "chip" | "button"
  chipProps?: ChipProps
  buttonProps?: ButtonProps
}

export interface DemoTableItem {
  [key: string]: DemoTableItemValue
}

export interface DemoTableItemValue {
  value: string
  spanClassName?: string
  chipProps?: ChipProps
  buttonProps?: ButtonProps
}

export default function DemoTable({
  columns,
  items,
  selectionMode = "single",
  onRowAction = console.log,
  hideTopContent = false,
  hideBottomContent = false,
  hideActions = false,
}: {
  columns: DemoTableColumn[]
  items: DemoTableItem[]
  hideTopContent?: boolean
  hideBottomContent?: boolean
  selectionMode?: TableProps["selectionMode"]
  onRowAction?: TableProps["onRowAction"]
  hideActions?: boolean
}) {
  return (
    <Table
      aria-label="Demo table"
      selectionMode={selectionMode}
      onRowAction={onRowAction}
      onSortChange={console.log}
      classNames={{
        base: "grid grid-rows-[auto_minmax(0,1fr)_auto] max-h-full",
        wrapper: "h-full p-0 rounded",
        thead: "[&>tr]:!rounded-none",
        th: "!rounded-none",
      }}
      isHeaderSticky
      topContentPlacement="outside"
      topContent={
        hideTopContent ? (
          <div />
        ) : (
          <div
            className={twMerge(
              "flex flex-wrap justify-start space-x-0 space-y-2 @omd:space-x-2 @omd:space-y-0"
            )}
          >
            <Input
              variant="bordered"
              placeholder="Search"
              className="w-full grow @omd:w-auto"
              startContent={<Icon path={mdiMagnify} className="w-6 text-default-500" />}
            />
            {hideActions ? null : (
              <div className="flex flex-row space-x-2">
                <Button
                  variant="bordered"
                  endContent={<Icon path={mdiFilterVariant} className="w-6 text-default-500" />}
                >
                  Filters
                </Button>
                <Button
                  variant="bordered"
                  endContent={<Icon path={mdiTableCog} className="w-6 text-default-500" />}
                >
                  Columns
                </Button>
                <Button color="primary" startContent={<Icon path={mdiPlus} className="w-6" />}>
                  New
                </Button>
              </div>
            )}
          </div>
        )
      }
      bottomContentPlacement="outside"
      bottomContent={
        hideBottomContent ? (
          <div />
        ) : (
          <div className="flex w-full items-center justify-center md:justify-between">
            <Button
              className="hidden md:flex"
              variant="flat"
              endContent={<Icon path={mdiTrayArrowDown} className="w-6 text-default-500" />}
            >
              Export
            </Button>
            <Pagination isCompact showControls color="primary" page={1} total={3} />
          </div>
        )
      }
    >
      <TableHeader columns={columns}>
        {(column) => {
          return (
            <TableColumn key={column.key} allowsSorting>
              {column.label}
            </TableColumn>
          )
        }}
      </TableHeader>
      <TableBody items={items}>
        {(item) => {
          return (
            <TableRow key={createId()} className="cursor-pointer">
              {(columnKey) => {
                const column = columns.find((column) => column.key === columnKey)
                const value = item[columnKey]
                return (
                  <TableCell key={columnKey}>
                    {column?.type === "span" ? (
                      <span className={twMerge("truncate", value?.spanClassName)}>
                        {value?.value}
                      </span>
                    ) : null}
                    {column?.type === "chip" ? (
                      <Chip {...column?.chipProps} {...value?.chipProps}>
                        {value?.value}
                      </Chip>
                    ) : null}
                    {column?.type === "button" ? (
                      <Button {...column?.buttonProps} {...value?.buttonProps}>
                        {value?.value}
                      </Button>
                    ) : null}
                  </TableCell>
                )
              }}
            </TableRow>
          )
        }}
      </TableBody>
    </Table>
  )
}
