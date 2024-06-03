import { APIErrorSource, APIErrorStatusCode } from "@/~sml-os-kit/modules/api/types"

// export default class APIError extends Error {
//   status: APIErrorStatusCode
//   source: APIErrorSource
//   constructor(status: APIErrorStatusCode, source: APIErrorSource, message: string) {
//     super(message)
//     this.status = status
//     this.source = source
//   }
// }

export default class APIError extends Error {
  public readonly status: APIErrorStatusCode
  public readonly source: APIErrorSource
  constructor(
    message: string,
    options: { cause?: Error; status: APIErrorStatusCode; source: APIErrorSource }
  ) {
    super(message, { cause: options.cause })
    this.status = options.status
    this.source = options.source
    if (options.cause) {
      this.stack = this.stack + "\n" + options.cause.stack
    }
  }
}
