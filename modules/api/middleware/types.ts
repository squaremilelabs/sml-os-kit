import { NextRequest, NextResponse } from "next/server"

export type Next = () => Promise<NextResponse | void>

export type Handler<ExpectedContextProperties> = (
  req: NextRequest,
  context: ExpectedContextProperties
) => NextResponse | Promise<NextResponse>

export type PipeFunction<RequiredContextProperties = object> = (
  req: NextRequest,
  context: RequiredContextProperties,
  next: Next
) => Promise<NextResponse | void>

export type PipeFunctionOrHandler<RequiredContextProperties> =
  | Handler<RequiredContextProperties>
  | PipeFunction<RequiredContextProperties>
