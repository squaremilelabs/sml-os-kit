export interface APIErrorResponseJson {
  type: APIErrorType
  message: string
  fullError?: object
}

export type APIErrorType = "system" | "business" | "database" | "external" | "unknown"
export type APIErrorStatusCode = 400 | 401 | 403 | 500
export type APISuccessStatusCode = 200 | 207

export type APIMethod = "get" | "put" | "post" | "delete"

export interface EndpointConfig {
  endpoint: string
  endpointParams?: { [key: string]: string } | never
  get?: {
    searchParams?: object | never
    response: object
  }
  put?: {
    payload: object
    searchParams?: object | never
    response: object
  }
  post?: {
    payload: object
    searchParams?: object | never
    response: object
  }
  delete?: {
    searchParams?: object | never
    response: object
  }
}
