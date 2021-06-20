import * as React from "react"
import { useCallback, useEffect, useState } from "react"

export function useDoubleClick(
  actionSingleClick: (e?: React.MouseEvent) => void,
  actionDoubleClick: (e?: React.MouseEvent) => void,
  delay = 250
) {
  const [clickCount, setClickCount] = useState(0)
  const [event, setEvent] = useState<React.MouseEvent | undefined>()

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (clickCount === 1) {
        actionSingleClick && actionSingleClick(event)
      }

      setClickCount(0)
    }, delay)

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (clickCount === 2) {
      setClickCount(0)
      actionDoubleClick && actionDoubleClick(event)
    }

    return () => clearTimeout(timer)

    // actionDoubleClick is very unstable and has many dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionSingleClick, clickCount, delay])

  const onClick = useCallback((e?: React.MouseEvent) => {
    setEvent(e)
    setClickCount((prev) => prev + 1)
  }, [])

  return { click: onClick }
}
