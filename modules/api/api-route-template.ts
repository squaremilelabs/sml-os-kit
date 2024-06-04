/* eslint-disable @typescript-eslint/ban-types */
// ^ only disabled for the template. this should be removed when implemented.

import { APISuccessResponseJson, EndpointConfig } from "@/~sml-os-kit/modules/api/types"
import { NextResponse } from "next/server"
import {
  pipe,
  ExtractMiddlewareContext,
  withAuthentication,
  withLogger,
  withErrorHandler,
  Handler,
} from "@/~sml-os-kit/modules/api/middleware"

/* 
  Template Usage Steps:

  1. Replace `NamedEndpoint` with the name of the endpoint
     > Prefer specifity over brevity
     > Examples:
       > `/admin/api/customers` => `AdminCustomersEndpoint`
       > `/portal/customer/api/update-profile` => `PortalCustomerUpdateProfileEndpoint`
       > `/admin/api/customers/[customerId]` => `AdminCustomersByCustomerIDEndpoint`

  2. Update the `Endpoint extends EndpointConfig`
     > Set the `endpoint` to the current route path.
       > Use NextJS notation for dynamic routes. For example: `/admin/api/customers/[customerId]`
     > Remove or define `endpointParams` depending on if it is a dynamic route
     > Remove or define each method (get, put, post, delete)
       > If removing, make sure to also remove the corresponding function code

  3. Remove the eslint-disable comment at the top of this file

*/

export type NamedEndpoint = Endpoint

interface Endpoint extends EndpointConfig {
  endpoint: "/api"
  endpointParams: {}
  post: {
    payload: {}
    searchParams: {}
    response: {} & APISuccessResponseJson
  }
  put: {
    payload: {}
    searchParams: {}
    response: {} & APISuccessResponseJson
  }
  delete: {
    searchParams: {}
    response: {} & APISuccessResponseJson
  }
  get: {
    searchParams: {}
    response: {} & APISuccessResponseJson
  }
}

/* --------------------- MIDDLEWARE ---------------------- */
const middlewares = [withErrorHandler, withLogger, withAuthentication]
type MiddlewareContext = ExtractMiddlewareContext<typeof middlewares> & {
  params: Endpoint["endpointParams"]
}

/* NOTE: You can specify unique middleware for each method if needed - just extract a new type to pass in to the corresponding handler */

/* --------------------- GET ---------------------- */
const GETHandler: Handler<MiddlewareContext> = async (request, context) => {
  return NextResponse.json<Endpoint["get"]["response"]>({
    meta: { affectedModels: [] },
  })
}
export const GET = pipe(...middlewares, GETHandler)

/* --------------------- PUT ---------------------- */
const PUTHandler: Handler<MiddlewareContext> = async (request, context) => {
  return NextResponse.json<Endpoint["put"]["response"]>({ meta: { affectedModels: [] } })
}
export const PUT = pipe(...middlewares, PUTHandler)

/* --------------------- POST ---------------------- */
const POSTHandler: Handler<MiddlewareContext> = async (request, context) => {
  return NextResponse.json<Endpoint["post"]["response"]>({ meta: { affectedModels: [] } })
}
export const POST = pipe(...middlewares, POSTHandler)

/* --------------------- DELETE ---------------------- */
const DELETEHandler: Handler<MiddlewareContext> = async (request, context) => {
  return NextResponse.json<Endpoint["delete"]["response"]>({ meta: { affectedModels: [] } })
}
export const DELETE = pipe(...middlewares, DELETEHandler)
