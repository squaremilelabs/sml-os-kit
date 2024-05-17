/* eslint-disable @typescript-eslint/ban-types */
// ^ only disabled for the template. this should be removed when implemented.

import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"
import _apiRouteHandler from "@/~sml-os-kit/modules/api/functions/_apiRouteHandler"
import { EndpointConfig } from "@/~sml-os-kit/modules/api/types"
import { NextRequest } from "next/server"

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
  get: {
    searchParams: {}
    response: {}
  }
  put: {
    payload: {}
    searchParams: {}
    response: {}
  }
  post: {
    payload: {}
    searchParams: {}
    response: {}
  }
  delete: {
    searchParams: {}
    response: {}
  }
}

/* --------------------- GET ---------------------- */
export async function GET(request: NextRequest, nextParams: Endpoint["endpointParams"]) {
  return _apiRouteHandler<Endpoint["get"]["response"]>({ request, skipLog: true }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const endpointParams = nextParams
      const searchParams = info.searchParams as Endpoint["get"]["searchParams"]
      let response: Endpoint["get"]["response"] = {}
      /* 

        Replace with logic
        (make sure to set `response`)
      
      */
      return {
        type: "success",
        status: 200,
        json: response,
      }
    } catch (error: Error & any) {
      return {
        type: "error",
        status: 400,
        json: {
          type: error?.cause ?? "business",
          message: error?.message ?? "Could not complete request",
          fullError: jsonifyError(error),
        },
      }
    }
  })
}

/* --------------------- PUT ---------------------- */
export async function PUT(request: NextRequest, nextParams: Endpoint["endpointParams"]) {
  return _apiRouteHandler<Endpoint["put"]["response"]>({ request }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const payload = info.payload as Endpoint["put"]["payload"]
      const endpointParams = nextParams
      const searchParams = info.searchParams as Endpoint["put"]["searchParams"]
      let response: Endpoint["put"]["response"] = {}
      /* 

        Replace with logic
        (make sure to set `response`)
      
      */
      return {
        type: "success",
        status: 200,
        json: response,
      }
    } catch (error: Error & any) {
      return {
        type: "error",
        status: 400,
        json: {
          type: error?.cause ?? "business",
          message: error?.message ?? "Could not complete request",
          fullError: jsonifyError(error),
        },
      }
    }
  })
}

/* --------------------- POST ---------------------- */
export async function POST(request: NextRequest, nextParams: Endpoint["endpointParams"]) {
  return _apiRouteHandler<Endpoint["post"]["response"]>({ request }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const payload = info.payload as Endpoint["post"]["payload"]
      const endpointParams = nextParams
      const searchParams = info.searchParams as Endpoint["post"]["searchParams"]
      let response: Endpoint["post"]["response"] = {}
      /* 

        Replace with logic
        (make sure to set `response`)
      
      */
      return {
        type: "success",
        status: 200,
        json: {},
      }
    } catch (error: Error & any) {
      return {
        type: "error",
        status: 400,
        json: {
          type: error?.cause ?? "business",
          message: error?.message ?? "Could not complete request",
          fullError: jsonifyError(error),
        },
      }
    }
  })
}

/* --------------------- DELETE ---------------------- */
export async function DELETE(request: NextRequest, nextParams: Endpoint["endpointParams"]) {
  return _apiRouteHandler<Endpoint["delete"]["response"]>({ request }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const endpointParams = nextParams
      const searchParams = info.searchParams as Endpoint["delete"]["searchParams"]
      let response: Endpoint["delete"]["response"] = {}
      /* 

        Replace with logic
        (make sure to set `response`)
      
      */
      return {
        type: "success",
        status: 200,
        json: {},
      }
    } catch (error: Error & any) {
      return {
        type: "error",
        status: 400,
        json: {
          type: error?.cause ?? "business",
          message: error?.message ?? "Could not complete request",
          fullError: jsonifyError(error),
        },
      }
    }
  })
}
