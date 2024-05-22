import { useLayoutEffect, useState } from "react"
import { useLocalStorage, useSessionStorage } from "usehooks-ts"

export default function useNavState() {
  const [navOpen, setNavOpen] = useState(true)
  const [navOpenLocal, setNavOpenLocal] = useSessionStorage("navOpen", true)

  useLayoutEffect(() => {
    setNavOpen(navOpenLocal)
  }, [navOpenLocal])

  return { navOpen, setNavOpen: setNavOpenLocal }
}
