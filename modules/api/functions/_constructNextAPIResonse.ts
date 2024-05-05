import { NextResponse } from "next/server"
import { APIErrorResponseJson, APIErrorStatusCode, APISuccessStatusCode } from "../types"

export default function _constructNextAPIResponse<
  T extends "success" | "error",
  SuccessType extends object = object,
>(
  status: T extends "success" ? APISuccessStatusCode : APIErrorStatusCode,
  json: T extends "success" ? SuccessType : APIErrorResponseJson
) {
  return NextResponse.json(json, { status })
}
