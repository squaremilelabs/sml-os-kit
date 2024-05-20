"use client"

import UserTable from "@/~sml-os-kit/auth/components/UserTable"

export default function UsersPage() {
  return (
    <div className="grid h-full w-full grid-rows-[auto_minmax(0,1fr)] space-y-4 self-center p-4 transition-layout lg:w-8/12">
      <h1 className="text-2xl font-semibold">Manage Users</h1>
      <UserTable />
    </div>
  )
}
