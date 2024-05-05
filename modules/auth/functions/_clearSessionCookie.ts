"use server"

import { getCookieName } from "@/~sml-os-kit/config/functions"
import { cookies } from "next/headers"

export default async function _clearSessionCookie() {
  cookies().delete(getCookieName())
}
