import { useLayoutEffect, useState } from "react"
import { useLocalStorage, useSessionStorage } from "usehooks-ts"

export default function useNavState() {
  const [navOpen, setNavOpen] = useState(true)
  const [navOpenLocal, setNavOpenLocal] = useSessionStorage("navOpen", true)

  useLayoutEffect(() => {
    setNavOpen(navOpenLocal)
    document.documentElement.classList.toggle("os-nav-open", navOpenLocal)
  }, [navOpenLocal])

  return { navOpen, setNavOpen: setNavOpenLocal }
}
