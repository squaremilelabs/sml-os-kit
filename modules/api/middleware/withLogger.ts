import { PipeFunction } from "@/~sml-os-kit/modules/api/middleware/types"
import prisma from "@/~sml-os-kit/db/prisma"
import { AuthenticationContext } from "@/~sml-os-kit/modules/api/middleware/withAuthentication"

export const withLogger: PipeFunction<AuthenticationContext> = async (req, context, next) => {
  const response = await next()

  if (response) {
    const responseData = await response.json()
    const logData = {
      userId: context.authUser?.id ?? "system",
      userEmail: context.authUser?.email ?? "system",
      method: req.method,
      endpoint: req.nextUrl.pathname,
      status: response.status,
      statusType: response.type, // TODO - is this meant to be success | error?
      request: JSON.stringify(req.body),
      response: JSON.stringify(responseData),
    }
    console.log(logData)
    //TODO - turn this back on
    // await prisma.apiLog.create({ data: logData })
  }

  return await next()
}
