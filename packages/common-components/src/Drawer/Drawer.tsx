import React from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
    },
  }),
)

export interface IDrawerProps {
  className?: string
}

const Drawer: React.FC<IDrawerProps> = ({ className }: IDrawerProps) => {
  const classes = useStyles()
  return <div className={clsx(className, classes.root)}>drawer</div>
}

export default Drawer
