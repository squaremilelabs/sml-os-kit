"use client"

import usePageRouter from "@/~sml-os-kit/common/hooks/usePageRouter"
import { getSiteConfig } from "@/~sml-os-kit/config/functions"
import _queryOSUsers from "@/~sml-os-kit/modules/auth/functions/_queryOSUsers"
import _queryUsers from "@/~sml-os-kit/~sml-firebase/auth/user-functions/_queryUsers"
import { mdiChevronDown, mdiMagnify } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Avatar,
  Button,
  Chip,
  Input,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
]

export default function OSUsersPage() {
  const siteConfig = getSiteConfig()

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return _queryOSUsers({ orderBy: [["displayName", "asc"]] })
    },
  })

  return (
    <div className="flex flex-col space-y-4 w-full h-full lg:w-8/12 self-center p-4">
      <h1 className="font-semibold text-2xl">Manage Users</h1>
      <Table
        fullWidth
        classNames={{
          wrapper: "h-full",
          base: "h-full",
        }}
        selectionMode="single"
        topContentPlacement="outside"
        topContent={
          <div className="flex flex-wrap justify-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
            <Input
              variant="bordered"
              placeholder="Search"
              className="grow w-full md:w-auto"
              startContent={<Icon path={mdiMagnify} className="w-6 text-default-500" />}
            />
            <div className="flex flex-row space-x-2">
              <Button
                variant="bordered"
                endContent={<Icon path={mdiChevronDown} className="w-5" />}
              >
                Filter
              </Button>
              <Button color="primary">Add Admin User</Button>
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
        <TableBody items={usersQuery?.data ?? []} isLoading={usersQuery.isLoading}>
          {(user) => (
            <TableRow key={user.id} className="cursor-pointer">
              {(columnKey) => {
                const portal = siteConfig.portals?.find(
                  (portal) => portal.id === user.role?.portalId
                )
                return (
                  <TableCell key={columnKey}>
                    {columnKey === "name" ? (
                      <div className="flex flex-row space-x-2 items-center">
                        <Avatar
                          src={user.photoUrl}
                          name={user.displayName}
                          size="sm"
                          getInitials={(val) => val[0]}
                        />
                        <span className="truncate">{user.displayName}</span>
                      </div>
                    ) : null}
                    {columnKey === "email" ? <span>{user.email}</span> : null}
                    {columnKey === "role" ? (
                      <Chip color={portal ? "default" : "primary"}>
                        {portal ? portal.title : user.role?.label}
                      </Chip>
                    ) : null}
                  </TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
