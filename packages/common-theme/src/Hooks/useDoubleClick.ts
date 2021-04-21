import { useCallback, useEffect, useState } from "react"

export function useDoubleClick(actionSingleClick: () => void, actionDoubleClick: () => void, delay = 250) {
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (clickCount === 1) {
        actionSingleClick && actionSingleClick()
      }

      setClickCount(0)
    }, delay)

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (clickCount === 2) {
      setClickCount(0)
      actionDoubleClick && actionDoubleClick()
    }

    return () => clearTimeout(timer)

    // actionDoubleClick is very unstable and has many dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionSingleClick, clickCount, delay])

  const onClick = useCallback(() => {
    setClickCount((prev) => prev + 1)
  }, [])

  return { click: onClick }
}
