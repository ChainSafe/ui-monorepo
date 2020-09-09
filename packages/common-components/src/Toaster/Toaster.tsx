// @flow
/** @jsx jsx */

import { useRef, useState, useEffect } from "react"
import { jsx } from "@emotion/core"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme, useTheme } from "@chainsafe/common-themes"
import { CheckCircle, CloseCircle, InfoCircle, CrossOutlined } from "../Icons"
import {
  Placement,
  ToastProps,
  TransitionState,
} from "react-toast-notifications"
export { ToastProvider, useToasts } from "react-toast-notifications"

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
const toastStates = (placement: Placement) => ({
  entering: { transform: getTranslate(placement) },
  entered: { transform: "translate3d(0,0,0)" },
  exiting: { transform: "scale(0.66)", opacity: 0 },
  exited: { transform: "scale(0.66)", opacity: 0 },
})

interface IStyleProps {
  height: string | number
  placement: Placement
  transitionState: TransitionState
  transitionDuration: number
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: (props: IStyleProps) => ({
      transition: `height ${theme.animation.transform - 100}ms 100ms`,
      height: props.height,
    }),
    parent: (props: IStyleProps) => ({
      borderRadius: 4,
      right: -360,
      boxShadow: theme.shadows.shadow1,
      display: "flex",
      alignItems: "center",
      padding: theme.constants.generalUnit * 2,
      marginBottom: theme.constants.generalUnit,
      transition: `transform ${theme.animation.transform}ms cubic-bezier(0.2, 0, 0, 1), opacity ${theme.animation.transform}ms`,
      width: 340,
      ...toastStates(props.placement)[props.transitionState],
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
      fill: theme.palette["gray"][6],
      marginLeft: `${theme.constants.generalUnit * 2}px`,
    },
  }),
)

const Toaster = ({
  appearance,
  children,
  onDismiss,
  placement,
  transitionDuration,
  transitionState,
}: ToastProps) => {
  const [height, setHeight] = useState<string | number>("auto")
  const elementRef = useRef<any>(null)

  const classes = useStyles({
    height,
    placement,
    transitionState,
    transitionDuration,
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
      <div
        // for some reason the class is not working properly
        // className={classes.parent}
        css={{
          borderRadius: 4,
          boxShadow: theme.shadows.shadow1,
          display: "flex",
          alignItems: "center",
          padding: theme.constants.generalUnit * 2,
          marginBottom: theme.constants.generalUnit,
          transition: `transform ${theme.animation.transform}ms cubic-bezier(0.2, 0, 0, 1), opacity ${theme.animation.transform}ms`,
          width: 340,
          ...toastStates(placement)[transitionState],
        }}
      >
        {appearance === "success" ? (
          <CheckCircle color="success" className={classes.typeIcon} />
        ) : appearance === "error" ? (
          <CloseCircle color="error" className={classes.typeIcon} />
        ) : (
          <InfoCircle color="secondary" className={classes.typeIcon} />
        )}
        {children}
        {onDismiss ? (
          <button onClick={() => onDismiss()} className={classes.closeButton}>
            <CrossOutlined className={classes.closeIcon} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default Toaster
