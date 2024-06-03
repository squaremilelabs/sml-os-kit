import { NextRequest, NextResponse } from "next/server"
import { Next, NextContext, PipeFunctionOrHandler } from "./types"

type ExtractType<T> = T extends PipeFunctionOrHandler<infer U> ? U : never
export type ExtractMiddlewareContext<T extends any[]> = {
  [K in keyof T]: ExtractType<T[K]>
}[number]

export function pipe(...pipeFunctions: PipeFunctionOrHandler<any>[]) {
  return async function internalHandler(req: NextRequest, context: NextContext) {
    return await startPiping(req, context, pipeFunctions, 0)
  }
}

async function startPiping(
  req: NextRequest,
  context: NextContext,
  pipeFunctions: PipeFunctionOrHandler<any>[],
  currentPipeFunctionIndex: number
) {
  const next: Next = async () => {
    // Get next pipeFunction, if there is one - if there isn't we stop execution
    const nextPipeFunction = pipeFunctions[currentPipeFunctionIndex + 1]
    if (!nextPipeFunction) return

    // Recursively run next pipeFunction
    return await startPiping(req, context, pipeFunctions, currentPipeFunctionIndex + 1)
  }

  // Initializes pipeFunction chain - the next function will
  // recursively run next pipeFunction when called by the current pipeFunction
  return await pipeFunctions[currentPipeFunctionIndex](req, context, next)
}
