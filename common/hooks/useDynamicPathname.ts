import { useParams, usePathname } from "next/navigation"

export default function useDynamicPathname() {
  const pathname = usePathname()
  const params = useParams()

  const reversedParams = Object.entries(params).reduce(
    (obj, [key, value]) => {
      if (typeof value === "string") {
        return { ...obj, [value]: `[${key}]` }
      }
      if (value instanceof Array) {
        const newKey = value.join("/")
        const newValue = `[...${key}]`
        return { ...obj, [newKey]: newValue }
      }
      return obj
    },
    {} as { [x: string]: string }
  )

  let dynamicPathname: string = pathname
  Object.entries(reversedParams).forEach(([searchKey, replaceValue]) => {
    dynamicPathname = dynamicPathname.replace(searchKey, replaceValue)
  })
  return dynamicPathname
}
