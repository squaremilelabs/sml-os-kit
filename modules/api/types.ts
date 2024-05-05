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
  url: string
  urlParams?: object | never
  get?: {
    params: object | never
    response: object
  }
  put?: {
    data: object
    params: object | never
    response: object
  }
  post?: {
    data: object
    params: object | never
    response: object
  }
  delete?: {
    params: object | never
    response: object
  }
}
