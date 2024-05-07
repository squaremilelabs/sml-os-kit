"use client"
import UserTable from "@/~sml-os-kit/modules/auth/components/UserTable"

export default function OSUsersPage() {
  return (
    <div className="flex flex-col space-y-4 w-full h-full lg:w-8/12 self-center p-4 transition-all">
      <h1 className="font-semibold text-2xl">Manage Users</h1>
      <UserTable
        tableClassNames={{
          wrapper: "h-full",
          base: "h-full",
        }}
      />
    </div>
  )
}
