import { useEffect, useState } from "react"

interface IUseOnScroll {
  onScroll?: (e: Event) => void
  onScrollUp?: (e: Event) => void
  onScrollDown?: (e: Event) => void
}

export function useOnScroll({
  onScroll,
  onScrollDown,
  onScrollUp
}: IUseOnScroll) {
  const [scrollTop, setScrollTop] = useState(0)
  useEffect(() => {
    function onScrollFunc(e: Event) {
      const currentPosition = document.documentElement.scrollTop // or use document.documentElement.scrollTop;
      if (onScroll && scrollTop != currentPosition) {
        onScroll(e)
      }
      if (currentPosition > scrollTop) {
        // downscroll code
        onScrollDown && onScrollDown(e)
      } else {
        // upscroll code
        onScrollUp && onScrollUp(e)
      }
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition)
    }

    window.addEventListener("scroll", onScrollFunc)
    return () => window.removeEventListener("scroll", onScrollFunc)
  }, [scrollTop, onScrollDown, onScrollUp, onScroll])

}