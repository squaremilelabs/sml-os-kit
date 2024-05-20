export interface ModulesConfig {
  roadmap: {
    enabled: boolean
    notion?: {
      ticketsDatabaseId: string
      patchesDatabaseId: string
      featuresDatabaseId: string
    }
  }
}
