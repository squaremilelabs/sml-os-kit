import APIError from "@/~sml-os-kit/modules/api/error"
import { PipeFunction } from "./types"
import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"
import { NextResponse } from "next/server"
import { APIErrorResponseJson } from "@/~sml-os-kit/modules/api/types"

export const withErrorHandler: PipeFunction = async (req, params, next) => {
  try {
    return await next()
  } catch (error: Error & any) {
    if (error instanceof APIError) {
      return NextResponse.json<APIErrorResponseJson>(
        {
          source: error.source,
          message: error.message,
          fullError: jsonifyError(error),
        },
        { status: error.status }
      )
    } else {
      return NextResponse.json<APIErrorResponseJson>(
        {
          source: "os",
          message: "An unexpected error occurred.",
          fullError: jsonifyError(error as Error & any),
        },
        { status: 500 }
      )
    }
  }
}
