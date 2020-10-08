import React, { useRef, useState, useEffect } from "react"
import clsx from "clsx"
import {
  ITheme,
  useTheme,
  makeStyles,
  createStyles,
} from "@imploy/common-themes"
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

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: (props: IStyleProps) => ({
      transition: `height ${theme.animation.transform - 100}ms 100ms`,
      height: props.height,
      position: "relative",
      zIndex: theme.zIndex?.layer4,
    }),
    parent: (props: IStyleProps) => ({
      borderRadius: 4,
      boxShadow: theme.shadows.shadow1,
      display: "flex",
      alignItems: "center",
      padding: theme.constants.generalUnit * 2,
      backgroundColor: theme.palette.common.white.main,
      marginBottom: theme.constants.generalUnit,
      transition: `transform ${theme.animation.transform}ms cubic-bezier(0.2, 0, 0, 1), opacity ${theme.animation.transform}ms`,
      width: WidthToaster,
      "&.entering": { transform: getTranslate(props.placement) },
      "&.entered": { transform: "translate3d(0,0,0)" },
      "&.exiting": { transform: "scale(0.66)", opacity: 0 },
      "&.exited": { transform: "scale(0.66)", opacity: 0 },
    }),
    root: {
      display: "flex",
      alignItems: "center",
      boxShadow: theme.shadows.shadow2,
      borderRadius: 4,
      padding: `${theme.constants.generalUnit * 2}px`,
    },
    typeIcon: {
      marginRight: `${theme.constants.generalUnit * 2}px`,
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
    },
    closeIcon: {
      fontSize: `${theme.constants.generalUnit * 1.5}px`,
      fill: theme.palette.additional["gray"][6],
      marginLeft: `${theme.constants.generalUnit * 2}px`,
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

  const theme: ITheme = useTheme()

  useEffect(() => {
    if (transitionState === "entered") {
      const el = elementRef.current
      setHeight(el.offsetHeight + theme.constants.generalUnit)
    }
    if (transitionState === "exiting") {
      setHeight(0)
    }
  }, [transitionState])

  return (
    <div ref={elementRef} className={classes.container}>
      <div className={clsx(classes.parent, placement, transitionState)}>
        {appearance === "success" ? (
          <CheckCircleIcon color="success" className={classes.typeIcon} />
        ) : appearance === "error" ? (
          <CloseCircleIcon color="error" className={classes.typeIcon} />
        ) : (
          <InfoCircleIcon color="secondary" className={classes.typeIcon} />
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
