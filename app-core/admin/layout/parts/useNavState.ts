import { useLayoutEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export default function useNavState() {
  const [navOpen, setNavOpen] = useState(true)
  const [navOpenLocal, setNavOpenLocal] = useLocalStorage("navOpen", true)

  useLayoutEffect(() => {
    setNavOpen(navOpenLocal)
  }, [navOpenLocal])

  return { navOpen, setNavOpen: setNavOpenLocal }
}
