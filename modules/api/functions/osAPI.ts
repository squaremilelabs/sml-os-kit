import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { APIErrorResponseJson, APIMethod, EndpointConfig } from "../types"
import { getAgentName } from "@/~sml-os-kit/config/functions"

interface OsAPIInput<M extends APIMethod, E extends EndpointConfig> {
  method: M
  endpoint: E["url"]
  params?: E["urlParams"] extends { [key: string]: string } ? E["urlParams"] : never
  searchParams?: string
  asUserId?: string // for agent
}

interface OsAPIInputWithData<M extends APIMethod, E extends EndpointConfig>
  extends OsAPIInput<M, E> {
  data: E[M] extends { data: any } ? E[M]["data"] : never
}

interface OsAPIResponse<M extends APIMethod, E extends EndpointConfig> {
  type: "success" | "error"
  data: E[M] extends { response: object } ? E[M]["response"] : unknown
}

function isInputWithData<M extends APIMethod, E extends EndpointConfig>(
  input: OsAPIInput<M, E> | OsAPIInputWithData<M, E>
): input is OsAPIInputWithData<M, E> {
  return "data" in input
}

export default async function osAPI<M extends APIMethod, E extends EndpointConfig = never>(
  input: E[M] extends { data: any } ? OsAPIInputWithData<M, E> : OsAPIInput<M, E>
): Promise<OsAPIResponse<M, E>> {
  try {
    // set up url from dynamic path
    let url = input.endpoint
    if (input.params) {
      Object.entries(input.params).forEach(([key, value]) => {
        url = url.replace(`[${key}]`, value)
      })
    }

    const config: AxiosRequestConfig = {
      method: input.method,
      url: url,
      data: isInputWithData<M, E>(input) ? input.data : undefined,
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