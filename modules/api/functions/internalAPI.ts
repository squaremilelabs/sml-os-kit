import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { APIErrorResponseJson, APIMethod, EndpointConfig } from "../types"
import { getAgentName } from "@/~sml-os-kit/config/functions"

interface InternalAPIInput<M extends APIMethod, E extends EndpointConfig> {
  method: M
  endpoint: E["endpoint"]
  endpointParams?: E["endpointParams"] extends { [key: string]: string }
    ? E["endpointParams"]
    : never
  searchParams?: E[M] extends { searchParams: object } ? E[M]["searchParams"] : never
  asUserId?: string // for agent
}

interface InternalAPIInputWithPayload<M extends APIMethod, E extends EndpointConfig>
  extends InternalAPIInput<M, E> {
  payload: E[M] extends { payload: any } ? E[M]["payload"] : never
}

interface OsAPIResponse<M extends APIMethod, E extends EndpointConfig> {
  type: "success" | "error"
  data: E[M] extends { response: object } ? E[M]["response"] : unknown
}

function isInputWithPayload<M extends APIMethod, E extends EndpointConfig>(
  input: InternalAPIInput<M, E> | InternalAPIInputWithPayload<M, E>
): input is InternalAPIInputWithPayload<M, E> {
  return "payload" in input
}

export default async function internalAPI<M extends APIMethod, E extends EndpointConfig = never>(
  input: E[M] extends { payload: any } ? InternalAPIInputWithPayload<M, E> : InternalAPIInput<M, E>
): Promise<OsAPIResponse<M, E>> {
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
        [getAgentName()]: input.asUserId,
      }
    }

    const response = await axios(config)
    return { type: "success", data: response.data }
  } catch (error: AxiosError & any) {
    console.error(error.toJSON())
    if (error.response) {
      return { type: "error", data: error.response.data as APIErrorResponseJson }
    } else if (error.request) {
      return { type: "error", data: { message: "No response was received" } }
    } else {
      return { type: "error", data: { message: "Developer error" } }
    }
  }
}
