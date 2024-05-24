"use client"

import UserTable from "@/~sml-os-kit/auth/components/UserTable"

export default function UsersPage() {
  return (
    <div className="grid h-full w-olg max-w-full grid-rows-[auto_minmax(0,1fr)] gap-4 p-4 transition-layout">
      <h1 className="text-2xl font-semibold">Manage Users</h1>
      <UserTable />
    </div>
  )
}
