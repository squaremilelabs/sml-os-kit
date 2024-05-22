import { Prisma } from "@prisma/client"

export interface APIErrorResponseJson {
  source: APIErrorSource
  message: string
  fullError?: object
}

export type APIErrorSource = "os" | "business" | "database" | "external" | "unknown"
export type APIErrorStatusCode =
  | 400 // Bad Request
  | 401 // Not authenticated
  | 403 // Not authorized
  | 500 // Unhandled server error

export type APISuccessStatusCode =
  | 200 // Complete success
  | 207 // Partial success

export type APIMethod = "get" | "put" | "post" | "delete"

export interface APISuccessResponseJson {
  [key: string]: any
  meta: {
    affectedModels: Prisma.ModelName[]
  }
}

export interface EndpointConfig {
  endpoint: string
  endpointParams?: { [key: string]: string } | never
  post?: {
    payload?: object
    searchParams?: object | never
    response: APISuccessResponseJson
  }
  put?: {
    payload?: object
    searchParams?: object | never
    response: APISuccessResponseJson
  }
  delete?: {
    searchParams?: object | never
    response: APISuccessResponseJson
  }
  get?: {
    searchParams?: object | never
    response: APISuccessResponseJson
  }
}
