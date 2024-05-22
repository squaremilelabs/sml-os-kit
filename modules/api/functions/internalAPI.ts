import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { APIErrorResponseJson, APIMethod, EndpointConfig } from "../types"
import { authActorHeaderName } from "@/~sml-os-kit/config/auth/constants"

interface InternalAPIInput<M extends APIMethod, E extends EndpointConfig> {
  method: M
  endpoint: E["endpoint"]
  endpointParams?: E["endpointParams"] extends { [key: string]: string }
    ? E["endpointParams"]
    : never
  searchParams?: E[M] extends { searchParams: object } ? E[M]["searchParams"] : never
  asUserId?: string
}

interface InternalAPIInputWithPayload<M extends APIMethod, E extends EndpointConfig>
  extends InternalAPIInput<M, E> {
  payload: E[M] extends { payload: any } ? E[M]["payload"] : never
}

interface InternalAPISuccessResponse<M extends APIMethod, E extends EndpointConfig> {
  type: "success"
  data: E[M] extends { response: object } ? E[M]["response"] : unknown
}
interface InternalAPIErrorResponse {
  type: "error"
  error: APIErrorResponseJson
}

function isInputWithPayload<M extends APIMethod, E extends EndpointConfig>(
  input: InternalAPIInput<M, E> | InternalAPIInputWithPayload<M, E>
): input is InternalAPIInputWithPayload<M, E> {
  return "payload" in input
}

export default async function internalAPI<M extends APIMethod, E extends EndpointConfig = never>(
  input: E[M] extends { payload: any } ? InternalAPIInputWithPayload<M, E> : InternalAPIInput<M, E>
): Promise<InternalAPISuccessResponse<M, E> | InternalAPIErrorResponse> {
  try {
    // set up url from dynamic path
    let url = input.endpoint
    if (input.endpointParams) {
      Object.entries(input.endpointParams).forEach(([key, value]) => {
        url = url.replace(`[${key}]`, value)
      })
    }

    const config: AxiosRequestConfig = {
      method: input.method,
      url: url,
      data: isInputWithPayload<M, E>(input) ? input.payload : undefined,
      params: input.searchParams,
      withCredentials: true,
    }

    if (input.asUserId) {
      config.headers = {
        [authActorHeaderName]: input.asUserId,
      }
    }

    const response = await axios(config)
    return { type: "success", data: response.data }
  } catch (error: AxiosError & any) {
    console.error(error.toJSON())
    if (error.response) {
      return { type: "error", error: error.response.data as APIErrorResponseJson }
    } else if (error.request) {
      return { type: "error", error: { source: "business", message: "No response was received" } }
    } else {
      return { type: "error", error: { source: "os", message: "Developer error" } }
    }
  }
}
