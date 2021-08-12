import * as React from "react"
import { useCallback } from "react"

export function useDoubleClick(
  actionSingleClick: (e?: React.MouseEvent) => void,
  actionDoubleClick: (e?: React.MouseEvent) => void
) {

  const onClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      switch (e.detail) {
      case 1:
        actionSingleClick && actionSingleClick(e)
        break
      case 2:
        actionDoubleClick && actionDoubleClick(e)
        break
      // case 3:
      //   break
      }
    }
  }, [actionSingleClick, actionDoubleClick])

  return { click: onClick }
}
