import WorkInProcess from "@/~sml-os-kit/common/components/WorkInProcess"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Logs",
}

export default function OSLogsPage() {
  return <WorkInProcess />
}
