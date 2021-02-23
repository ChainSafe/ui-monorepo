import React, { useRef, useState, useEffect } from "react"
import clsx from "clsx"
import {
  ITheme,
  useTheme,
  makeStyles,
  createStyles,
} from "@chainsafe/common-theme"
import { Placement, ToastProps } from "react-toast-notifications"
import {
  CheckCircleIcon,
  CloseCircleIcon,
  CrossOutlinedIcon,
  InfoCircleIcon,
} from "../Icons"
export { ToastProvider, useToasts } from "react-toast-notifications"

const WidthToaster = 340

function getTranslate(placement: Placement) {
  const pos = placement.split("-")
  const relevantPlacement = pos[1] === "center" ? pos[0] : pos[1]
  const translateMap = {
    right: "translate(120%, 0)",
    left: "translate(-120%, 0)",
    bottom: "translate(0, 120%)",
    top: "translate(0, -120%)",
  }

  return translateMap[relevantPlacement]
}

interface IStyleProps {
  height: string | number
  placement: Placement
}

const useStyles = makeStyles(
  ({ animation, zIndex, constants, palette, overrides }: ITheme) =>
    createStyles({
      root: ({ height }: IStyleProps) => ({
        transition: `height ${animation.transform - 100}ms 100ms`,
        height: height,
        position: "relative",
        zIndex: zIndex?.layer4,
        ...overrides?.Toaster?.root,
      }),
      inner: ({ placement }: IStyleProps) => ({
        borderRadius: 4,
        border: `1px solid ${palette.additional["gray"][6]}`,
        display: "flex",
        alignItems: "center",
        padding: constants.generalUnit * 2,
        backgroundColor: palette.additional["gray"][3],
        marginBottom: constants.generalUnit,
        transition: `transform ${animation.transform}ms cubic-bezier(0.2, 0, 0, 1), opacity ${animation.transform}ms`,
        width: WidthToaster,
        "&.entering": { transform: getTranslate(placement) },
        "&.entered": { transform: "translate3d(0,0,0)" },
        "&.exiting": { transform: "scale(0.66)", opacity: 0 },
        "&.exited": { transform: "scale(0.66)", opacity: 0 },
        ...overrides?.Toaster?.inner,
      }),
      typeIcon: {
        marginRight: `${constants.generalUnit * 2}px`,
        ...overrides?.Toaster?.typeIcon?.root,
        "&.success": {
          ...overrides?.Toaster?.typeIcon?.success,
        },
        "&.error": {
          ...overrides?.Toaster?.typeIcon?.error,
        },
        "&.info": {
          ...overrides?.Toaster?.typeIcon?.info,
        },
      },
      closeButton: {
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        ...overrides?.Toaster?.closeButton,
      },
      closeIcon: {
        fontSize: `${constants.generalUnit * 1.5}px`,
        fill: palette.additional["gray"][6],
        marginLeft: `${constants.generalUnit * 2}px`,
        ...overrides?.Toaster?.closeIcon,
      },
    }),
)

const Toaster = ({
  appearance,
  children,
  onDismiss,
  placement,
  transitionState,
}: ToastProps) => {
  const [height, setHeight] = useState<string | number>("auto")
  const elementRef = useRef<any>(null)

  const classes = useStyles({
    height,
    placement,
  })

  const { constants }: ITheme = useTheme()

  useEffect(() => {
    if (transitionState === "entered") {
      const el = elementRef.current
      setHeight(el.offsetHeight + constants.generalUnit)
    }
    if (transitionState === "exiting") {
      setHeight(0)
    }
  }, [transitionState])

  return (
    <div ref={elementRef} className={classes.root}>
      <div className={clsx(classes.inner, placement, transitionState)}>
        {appearance === "success" ? (
          <CheckCircleIcon className={clsx(classes.typeIcon, appearance)} />
        ) : appearance === "error" ? (
          <CloseCircleIcon className={clsx(classes.typeIcon, appearance)} />
        ) : (
          <InfoCircleIcon className={clsx(classes.typeIcon, appearance)} />
        )}
        {children}
        {onDismiss ? (
          <button onClick={() => onDismiss()} className={classes.closeButton}>
            <CrossOutlinedIcon className={classes.closeIcon} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default Toaster
