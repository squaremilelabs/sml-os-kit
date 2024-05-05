import jsonifyError from "@/~sml-os-kit/common/functions/jsonifyError"
import apiRouteHandler from "@/~sml-os-kit/modules/api/handler"
import { EndpointConfig } from "@/~sml-os-kit/modules/api/types"
import { NextRequest } from "next/server"

// replace NamedEndpoint
// example: `/admin/api/customers/deactivate` => `AdminCustomersDeactivateEndpoint`
export type NamedEndpoint = Endpoint

interface Endpoint extends Partial<EndpointConfig> {
  url: "/endpoint" // always replace
  urlParams: {}
  get: {
    params: {}
    response: {}
  }
  put: {
    data: {}
    params: {}
    response: {}
  }
  post: {
    data: {}
    params: {}
    response: {}
  }
  delete: {
    params: {}
    response: {}
  }
}

/* --------------------- GET ---------------------- */
export async function GET(request: NextRequest, nextParams: Endpoint["urlParams"]) {
  return apiRouteHandler<Endpoint["get"]["response"]>({ request, skipLog: true }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const params = nextParams
      const searchParams = info.searchParams as Endpoint["get"]["params"]
      // -- get logical --
      //
      //
      //
      //
      // -- hey, nice logic --
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

/* --------------------- PUT ---------------------- */
export async function PUT(request: NextRequest, nextParams: Endpoint["urlParams"]) {
  return apiRouteHandler<Endpoint["put"]["response"]>({ request }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const data = info.data as Endpoint["put"]["data"]
      const params = nextParams
      const searchParams = info.searchParams as Endpoint["put"]["params"]
      // -- get logical --
      //
      //
      //
      //
      // -- hey, nice logic --
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

/* --------------------- POST ---------------------- */
export async function POST(request: NextRequest, nextParams: Endpoint["urlParams"]) {
  return apiRouteHandler<Endpoint["post"]["response"]>({ request }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const data = info.data as Endpoint["post"]["data"]
      const params = nextParams
      const searchParams = info.searchParams as Endpoint["post"]["params"]
      // -- get logical --
      //
      //
      //
      //
      // -- hey, nice logic --
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
export async function DELETE(request: NextRequest, nextParams: Endpoint["urlParams"]) {
  return apiRouteHandler<Endpoint["delete"]["response"]>({ request }, async (info) => {
    try {
      const user = info.user
      const agentUser = info.agentUser
      const params = nextParams
      const searchParams = info.searchParams as Endpoint["delete"]["params"]
      // -- get logical --
      //
      //
      //
      //
      // -- hey, nice logic --
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
