import {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  TouchEvent as ReactTouchEvent,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef
} from "react"

const MOVE_THRESHOLD = 20

export type LongPressEvent<Target = Element> = ReactMouseEvent<Target> | ReactTouchEvent<Target>;

function isTouchEvent<Target>(event: LongPressEvent<Target>): event is ReactTouchEvent<Target> {
  const { nativeEvent } = event
  return window.TouchEvent ? nativeEvent instanceof TouchEvent : "touches" in nativeEvent
}
function isMouseEvent<Target>(event: LongPressEvent<Target>): event is ReactMouseEvent<Target> {
  return event.nativeEvent instanceof MouseEvent
}

type Coordinates = {
  x: number
  y: number
} | null;

function getCurrentPosition<Target>(event: LongPressEvent<Target>): Coordinates {
  if (isTouchEvent(event)) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY
    }
  }

  if (isMouseEvent(event)) {
    return {
      x: event.pageX,
      y: event.pageY
    }
  }

  return null
}

export type LongPressResult<
  Target,
> = {
  onMouseDown: MouseEventHandler<Target>
  onMouseUp: MouseEventHandler<Target>
  onMouseMove: MouseEventHandler<Target>
  onMouseLeave: MouseEventHandler<Target>
  onTouchStart: TouchEventHandler<Target>
  onTouchMove: TouchEventHandler<Target>
  onTouchEnd: TouchEventHandler<Target>
}

export function useLongPress<
  Target extends Element = Element,
>(
  onLongPress: ((e?: LongPressEvent<Target>) => void) | null,
  onClick: ((e?: LongPressEvent<Target>) => void) | null,
  delay = 400
): LongPressResult<Target> {
  const isLongPressActive = useRef(false)
  const isPressed = useRef(false)
  const hasMoved = useRef(false)
  const timer = useRef<NodeJS.Timeout>()
  const savedLongPress = useRef(onLongPress)
  const savedOnClick = useRef(onClick)
  const startPosition = useRef<Coordinates>(null)

  const start = useCallback(
    (event: LongPressEvent<Target>) => {
      // Prevent multiple start triggers
      if (isPressed.current) {
        return
      }

      // Ignore events other than mouse and touch
      if (!isMouseEvent(event) && !isTouchEvent(event)) {
        return
      }

      startPosition.current = getCurrentPosition(event)
      isPressed.current = true

      timer.current = setTimeout(() => {
        if (savedLongPress.current) {
          savedLongPress.current(event)
          isLongPressActive.current = true
        }
      }, delay)

    }, [delay]
  )

  const cancel = useCallback(
    (event: LongPressEvent<Target>) => {
      // Ignore events other than mouse and touch
      if (!isMouseEvent(event) && !isTouchEvent(event)) {
        return
      }

      console.log("hasMoved", hasMoved)
      console.log("isLongPressActive", isLongPressActive)

      startPosition.current = null
      isPressed.current = false
      timer.current && clearTimeout(timer.current)
      !isLongPressActive.current && !hasMoved.current && savedOnClick.current && savedOnClick.current(event)
      isLongPressActive.current = false
    }, []
  )

  const handleMove = useCallback(
    (event: LongPressEvent<Target>) => {
      if (startPosition.current) {
        const currentPosition = getCurrentPosition(event)
        /* istanbul ignore else */
        if (currentPosition) {
          const movedDistance = {
            x: Math.abs(currentPosition.x - startPosition.current.x),
            y: Math.abs(currentPosition.y - startPosition.current.y)
          }

          // If moved outside move tolerance box then cancel long press
          if (movedDistance.x > MOVE_THRESHOLD || movedDistance.y > MOVE_THRESHOLD) {
            hasMoved.current = true
            cancel(event)
          }
        }
      }
    },
    [cancel]
  )

  useEffect(
    () => (): void => {
      // Clear timeout on unmount
      timer.current !== undefined && clearTimeout(timer.current)
    },
    []
  )

  useEffect(() => {
    savedLongPress.current = onLongPress
    savedOnClick.current = onClick
  }, [onLongPress, onClick])

  return {
    onMouseDown: start,
    onMouseMove: handleMove,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchMove: handleMove,
    onTouchEnd: cancel
  }
}