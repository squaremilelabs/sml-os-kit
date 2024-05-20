import RoadmapPage from "./RoadmapPage"
import APILogsPage from "./APILogsPage"
import UsersPage from "./UsersPage"

type ConsoleCorePageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ConsoleCorePageProps) {
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

export default function ConsoleCorePageRoot({ params }: ConsoleCorePageProps) {
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
