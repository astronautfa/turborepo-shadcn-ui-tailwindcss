import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: no-preference)'

export default () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [firefox, setFirefox] = useState(false)

  useEffect(() => {
    setFirefox("InstallTrigger" in window)
    const listener = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(!event.matches)

    const media = window.matchMedia(QUERY)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return { prefersReducedMotion, firefox }
}
