import APIError from "@/~sml-os-kit/modules/api/error"
import { PipeFunction } from "./types"
import _constructNextAPIResponse from "@/~sml-os-kit/modules/api/functions/_constructNextAPIResonse"
import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"

export const withErrorHandler: PipeFunction = async (req, params, next) => {
  try {
    return await next()
  } catch (error: Error & any) {
    if (error instanceof APIError) {
      return _constructNextAPIResponse<"error">(error.status, {
        source: error.source,
        message: error.message,
        fullError: jsonifyError(error),
      })
    } else {
      return _constructNextAPIResponse<"error">(500, {
        source: "os",
        message: "An unexpected error occurred.",
        fullError: jsonifyError(error),
      })
    }
  }
}
