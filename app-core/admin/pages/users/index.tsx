"use client"

import UserTable from "@/~sml-os-kit/modules/auth/components/UserTable"

export default function OSUsersPage() {
  return (
    <div className="grid grid-rows-[auto_minmax(0,1fr)] space-y-4 w-full h-full lg:w-8/12 self-center p-4 transition-layout">
      <h1 className="font-semibold text-2xl">Manage Users</h1>
      <UserTable />
    </div>
  )
}
