import { useCallback, useEffect } from "react"
import { animateScroll as scroll } from "react-scroll"

export function useScrollToTop(onMount = false) {
  const scrollToTop = useCallback(() => {
    scroll.scrollToTop()
  }, [])
  if (onMount) {
    useEffect(() => {
      scrollToTop()
    }, [])
  }
  return scrollToTop
}
