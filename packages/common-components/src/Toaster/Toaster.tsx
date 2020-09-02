import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex ? theme.zIndex.layer1 : 99,
      position: "fixed",
      top: 24,
      right: 24,
    },
  }),
)

export type IToasterType = "success" | "error" | "warning"

export interface IToasterProps {
  children?: ReactNode | ReactNode[]
  open: boolean
  className?: string
}

const Toaster: React.FC<IToasterProps> = ({
  className,
  open,
  children,
}: IToasterProps) => {
  if (!open) return null
  console.log(open)
  const classes = useStyles()

  return <div className={clsx(classes.root, className)}>{children}</div>
}

export default Toaster
