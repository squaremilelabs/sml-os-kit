export interface ModulesConfig {
  roadmap: {
    enabled: boolean
    notion?: {
      roadmapUrl: string
      ticketsDatabaseId: string
      patchesDatabaseId: string
      featuresDatabaseId: string
    }
  }
}
