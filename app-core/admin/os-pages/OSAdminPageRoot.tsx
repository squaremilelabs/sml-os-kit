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
}

export default function OSAdminPageRoot({ params }: OSAdminPageProps) {
  if (params.slug === "users") {
    return <UsersPage />
  }
  if (params.slug === "api-logs") {
    return <APILogsPage />
  }
  return null
}
