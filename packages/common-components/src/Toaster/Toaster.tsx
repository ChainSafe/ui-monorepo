import React, { ReactNode } from "react"
// import { makeStyles, createStyles } from "@material-ui/styles"
// import { ITheme } from "@chainsafe/common-themes"
// import clsx from "clsx"
import Transition from "react-transition-group/Transition"

const duration = 300

const defaultStyle = {
  position: "fixed",
  top: "0",
  right: "-270px",
  zIndex: "1000",
}

const transitionStyles = {
  entered: {
    right: "24px",
  },
  exiting: {
    transform: "translateX(100%)",
    transition: `transform ${duration}ms ease-in-out`,
  },
  exited: {
    right: "-270px",
  },
}

// const useStyles = makeStyles((theme: ITheme) =>
//   createStyles({
//     root: {
//       zIndex: theme.zIndex ? theme.zIndex.layer1 : 99,
//       position: "fixed",
//       top: 24,
//       right: -280,
//     },
//   }),
// )

export type IToasterType = "success" | "error" | "warning"

export interface IToasterProps {
  children?: ReactNode | ReactNode[]
  open: boolean
  className?: string
}

const Toaster: React.FC<IToasterProps> = ({
  // className,
  open,
  children,
}: IToasterProps) => {
  // if (!open) return null
  // console.log(open)
  // const classes = useStyles()

  // return <div className={clsx(classes.root, className)}>{children}</div>

  return (
    <Transition in={open} timeout={3000} unmountOnExit>
      {(state) => {
        console.log(state)
        return (
          <div
            style={{ ...defaultStyle, ...transitionStyles[state] }}
            // className={clsx(classes.root, className)}
          >
            {children}
          </div>
        )
      }}
    </Transition>
  )
}

export default Toaster
