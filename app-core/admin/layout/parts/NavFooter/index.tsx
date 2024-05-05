import AdminUser from "@/~sml-os-kit/app-core/admin/layout/parts/AdminUser"
import ThemeSwitch from "@/~sml-os-kit/common/components/ThemeSwitch"
import TicketButton from "@/~sml-os-kit/modules/tickets/components/TicketButton"

export default function NavFooter() {
  return (
    <div className="flex flex-col space-y-2 h-fit px-4 items-stretch">
      <AdminUser />
      <div className="flex flex-row items-stretch">
        <ThemeSwitch />
        <TicketButton className="h-full grow" />
      </div>
    </div>
  )
}
