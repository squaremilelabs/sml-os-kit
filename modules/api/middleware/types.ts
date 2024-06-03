import { NextRequest, NextResponse } from "next/server"

export type Next = () => Promise<NextResponse | void>

export type NextContext = {
  params: any
}

export type Handler<ExpectedContextProperties> = (
  req: NextRequest,
  context: NextContext & ExpectedContextProperties
) => NextResponse | Promise<NextResponse>

export type PipeFunction<RequiredContextProperties = object> = (
  req: NextRequest,
  context: NextContext & RequiredContextProperties,
  next: Next
) => Promise<NextResponse | void>

export type PipeFunctionOrHandler<RequiredContextProperties> =
  | Handler<RequiredContextProperties>
  | PipeFunction<RequiredContextProperties>
