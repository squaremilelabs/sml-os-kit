import RoadmapPage from "@/~sml-os-kit/app-core/admin/os-pages/parts/RoadmapPage"
import APILogsPage from "./parts/APILogsPage"
import UsersPage from "./parts/UsersPage"

type OSAdminPageProps = {
  params: { slug: string }
}

export async function osAdminPageGenerateMetadata({ params }: OSAdminPageProps) {
  if (params.slug === "users") {
    return { title: "Users" }
  }
  if (params.slug === "api-logs") {
    return { title: "API Logs" }
  }
  if (params.slug === "roadmap") {
    return { title: "Roadmap" }
  }
}

export default function OSAdminPageRoot({ params }: OSAdminPageProps) {
  if (params.slug === "users") {
    return <UsersPage />
  }
  if (params.slug === "api-logs") {
    return <APILogsPage />
  }
  if (params.slug === "roadmap") {
    return <RoadmapPage />
  }
  return null
}
