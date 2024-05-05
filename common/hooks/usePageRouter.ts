"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type QueryParams = { [key: string]: string | null }

export default function usePageRouter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState<QueryParams>({})

  useEffect(() => {
    const current: QueryParams = {}
    searchParams.forEach((value, key) => {
      current[key] = value
    })
    setQuery(current)
  }, [searchParams])

  const push = useCallback(
    (newPathname: string | null, newQuery?: QueryParams, options?: { merge?: boolean }) => {
      let targetPathname = newPathname || pathname
      if (newQuery) {
        let pendingQuery: QueryParams = {}
        if (options?.merge) {
          pendingQuery = { ...query, ...newQuery }
        } else {
          pendingQuery = { ...newQuery }
        }
        const finalQuery = Object.entries(pendingQuery).reduce((result, [key, value]) => {
          if (value === undefined || value === null) {
            return result
          } else {
            return { ...result, [key]: value }
          }
        }, {})
        const newSearchParams = new URLSearchParams(finalQuery)
        targetPathname += `?${newSearchParams.toString()}`
      }
      router.push(targetPathname)
    },
    [router, query, pathname]
  )

  return { push, pathname, query }
}
