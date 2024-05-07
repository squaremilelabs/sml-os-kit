import { mdiChevronDown, mdiMagnify } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Button,
  Table,
  Input,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TableProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react"
import UserAvatar from "../UserAvatar"
import { useQuery } from "@tanstack/react-query"
import _queryOSUsers from "../../functions/_queryOSUsers"
import { Key, useMemo, useState } from "react"
import roles from "@/$sml-os-config/roles"
import UserModal from "../UserModal"

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
]

export default function UserTable({
  tableClassNames,
}: {
  tableClassNames?: TableProps["classNames"]
}) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState({
    includePortalUsers: false,
    includeDeactivated: false,
  })

  const usersQuery = useQuery({
    queryKey: ["users", filter],
    queryFn: async () => {
      return _queryOSUsers({
        where: [
          filter.includePortalUsers
            ? null
            : [
                "roleId",
                "in",
                roles.filter((role) => role.userType === "admin").map((role) => role.id),
              ],
          filter.includeDeactivated ? null : ["isDeactivated", "==", false],
        ],
        orderBy: [["displayName", "asc"]],
      })
    },
  })

  const displayedUsers = useMemo(
    () =>
      usersQuery?.data?.filter((user) => {
        return (
          user.displayName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        )
      }) ?? [],
    [search, usersQuery]
  )

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
  const { isOpen: isModalOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure()

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
    modalOnOpen()
  }

  const handleModalClose = () => {
    setSelectedUserId(undefined)
    modalOnClose()
  }

  return (
    <>
      <Table
        aria-label="Users table"
        fullWidth
        classNames={tableClassNames}
        selectionMode="single"
        onRowAction={(userId) => {
          if (typeof userId === "string") {
            handleUserSelect(userId)
          }
        }}
        topContentPlacement="outside"
        topContent={
          <div className="flex flex-wrap justify-start space-y-2 lg:space-y-0 space-x-0 lg:space-x-2">
            <Input
              variant="bordered"
              placeholder="Search"
              className="grow w-full lg:w-auto"
              startContent={<Icon path={mdiMagnify} className="w-6 text-default-500" />}
              value={search}
              onValueChange={setSearch}
            />
            <div className="flex flex-row space-x-2">
              <Popover isDismissable>
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    endContent={<Icon path={mdiChevronDown} className="w-5" />}
                  >
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col items-start justify-center space-y-2 p-4">
                    <Checkbox
                      isSelected={filter.includePortalUsers}
                      onValueChange={(isSelected) =>
                        setFilter((prev) => ({ ...prev, includePortalUsers: isSelected }))
                      }
                    >
                      Include Portal Users
                    </Checkbox>
                    <Checkbox
                      isSelected={filter.includeDeactivated}
                      onValueChange={(isSelected) =>
                        setFilter((prev) => ({ ...prev, includeDeactivated: isSelected }))
                      }
                    >
                      Include Deactivated
                    </Checkbox>
                  </div>
                </PopoverContent>
              </Popover>
              <Button color="primary" onPress={() => modalOnOpen()}>
                Add User
              </Button>
            </div>
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} minWidth={0}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={displayedUsers} isLoading={usersQuery.isLoading}>
          {(user) => (
            <TableRow key={user.id} className="cursor-pointer">
              {(columnKey) => {
                return (
                  <TableCell key={columnKey}>
                    {columnKey === "name" ? (
                      <div className="flex flex-row space-x-2 items-center">
                        <UserAvatar user={user} disableTooltip size="sm" />
                        <span className="truncate">{user.displayName}</span>
                      </div>
                    ) : null}
                    {columnKey === "email" ? <span>{user.email}</span> : null}
                    {columnKey === "role" ? (
                      <Chip color={user.role?.userType === "portal" ? "default" : "primary"}>
                        {user.role?.label}
                      </Chip>
                    ) : null}
                    {columnKey === "status" ? (
                      <Chip color={user.isDeactivated ? "danger" : "success"} variant="flat">
                        {user.isDeactivated ? "Deactivated" : "Active"}
                      </Chip>
                    ) : null}
                  </TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UserModal
        mode={selectedUserId ? "update" : "create"}
        userId={selectedUserId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}
