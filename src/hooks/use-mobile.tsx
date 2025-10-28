import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with actual value on mount to avoid hydration issues
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    // Use the matchMedia event directly for better performance
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }
    
    // Set initial value from media query
    setIsMobile(mql.matches)
    
    // Use the modern addEventListener API
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
