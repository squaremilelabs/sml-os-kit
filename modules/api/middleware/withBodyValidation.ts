import APIError from "@/~sml-os-kit/modules/api/error"
import { PipeFunction } from "@/~sml-os-kit/modules/api/middleware/types"
import { z } from "zod"

export const withBodyValidation =
  (zodSchema: z.ZodSchema): PipeFunction =>
  async (req, context, next) => {
    // Get request body and parse with zod
    const body = await req.json()
    const validation = zodSchema.safeParse(typeof body === "object" ? body : JSON.parse(body))

    if (!validation.success)
      throw new APIError("Validation: Invalid request body.", {
        cause: validation.error,
        status: 400,
        source: "os",
      })

    return await next()
  }
