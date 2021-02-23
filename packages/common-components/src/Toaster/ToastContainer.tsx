import React, { ReactNode } from "react"

import { Placement } from "react-toast-notifications"
import { ITheme } from "@chainsafe/common-theme"
import { makeStyles, createStyles } from "@material-ui/styles"

interface IStyleProps {
  placement: Placement;
  hasToasts: boolean;
}

const useStyles = makeStyles(({ zIndex, constants }: ITheme) =>
  createStyles({
    container: (props: IStyleProps) => ({
      boxSizing: "border-box",
      maxHeight: "100%",
      overflow: "hidden",
      padding: constants.generalUnit,
      position: "fixed",
      zIndex: zIndex?.blocker,
      ...placements[props.placement]
    })
  })
)

const placements = {
  "top-left": { top: 0, left: 0 },
  "top-center": { top: 0, left: "50%", transform: "translateX(-50%)" },
  "top-right": { top: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-center": { bottom: 0, left: "50%", transform: "translateX(-50%)" },
  "bottom-right": { bottom: 0, right: 0 }
}

export type ToastContainerProps = {
  children?: ReactNode;
  hasToasts: boolean;
  placement: Placement;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  hasToasts,
  placement,
  ...props
}) => {
  const classes = useStyles({
    hasToasts,
    placement
  })
  return <div className={classes.container} {...props} />
}

export default ToastContainer
