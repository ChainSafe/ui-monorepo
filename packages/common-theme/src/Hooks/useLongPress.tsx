import { useCallback, useRef } from "react"

export interface LongPressEvents {
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
}

const MOVE_THRESHOLD = 5

type Coordinates = {
  x: number
  y: number
} | null;

function getCurrentPosition(event: any): Coordinates {
  if (isTouchEvent(event)) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY
    }
  }
  else {
    return {
      x: event.pageX,
      y: event.pageY
    }
  }
}

export const useLongPress = (
  onLongPress: ((e?: React.MouseEvent) => void) | null,
  onClick: ((e?: React.MouseEvent) => void) | null,
  delay = 300
): LongPressEvents => {
  const shouldAllowClick = useRef(true)
  const timeout: any = useRef()
  const target: any = useRef()
  const startPosition = useRef<Coordinates>(null)

  const start = useCallback(
    (event: any) => {
      if (event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false
        })
        target.current = event.target
      }
      shouldAllowClick.current = true
      startPosition.current = getCurrentPosition(event)
      timeout.current = setTimeout(() => {
        onLongPress && onLongPress(event)
        shouldAllowClick.current = false
      }, delay)

    }, [onLongPress, delay]
  )

  const clear = useCallback(
    (shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      shouldTriggerClick && shouldAllowClick.current && onClick && onClick()
      shouldAllowClick.current = false
      if (target.current) {
        target.current.removeEventListener("touchend", preventDefault)
      }
    }, [onClick]
  )

  const move = useCallback(
    (event: any) => {
      if (startPosition.current) {
        const currentPosition = getCurrentPosition(event)
        if (currentPosition) {
          const movedDistance = {
            x: Math.abs(currentPosition.x - startPosition.current.x),
            y: Math.abs(currentPosition.y - startPosition.current.y)
          }

          if (movedDistance.x > MOVE_THRESHOLD || movedDistance.y > MOVE_THRESHOLD) {
            clear(false)
          }
        }
      }
    }, [clear]
  )

  return {
    // start
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    // end
    onMouseUp: () => clear(true),
    onTouchEnd: () => clear(true),
    // leave
    onMouseLeave: () => clear(false),
    // move
    onTouchMove: (e: React.TouchEvent) => move(e),
    onMouseMove: (e: React.MouseEvent) => move(e)
  }
}

const isTouchEvent = (event: any) => {
  return event && "touches" in event
}

const preventDefault = (event: any) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event.preventDefault && event.cancelable) {
    event.preventDefault()
  }
}
