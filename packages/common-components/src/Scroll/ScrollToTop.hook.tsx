import { useCallback, useEffect } from "react"
import { animateScroll as scroll } from "react-scroll"

export function useScrollToTop(onMount = false) {

  const scrollToTop = useCallback(() => {
    scroll.scrollToTop()
  }, [])

  useEffect(() => {
    if (onMount) {
      scrollToTop()
    }
  }, [onMount, scrollToTop])

  return scrollToTop
}
