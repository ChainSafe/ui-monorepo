import { useCallback, useRef, useState } from "react";

export const useLongPress = (
  onLongPress: ((e?: React.MouseEvent) => void) | null, 
  onClick: ((e?: React.MouseEvent) => void) | null,
  { delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout: any = useRef();
  const target: any = useRef();

  const start = useCallback(
    (event: any) => {
      if (event.target) {
        event.target.addEventListener("touchend", preventDefault, {
        passive: false
      });
      target.current = event.target;
    }
    timeout.current = setTimeout(() => {
      onLongPress && onLongPress(event);
      setLongPressTriggered(true);
    }, delay);

    }, [onLongPress, delay]
  );

  const clear = useCallback(
    (shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick && onClick();
      setLongPressTriggered(false);
      if (target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    }, [onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e: any)=> start(e),
    onTouchStart: (e: any)=> start(e),
    onMouseUp: (e: any)=> clear(e),
    onMouseLeave: ()=> clear(false),
    onTouchEnd: (e: any)=> clear(e)
  };
};

const isTouchEvent = (event: any) => {
  return "touches" in event;
};

const preventDefault = (event: any) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};
