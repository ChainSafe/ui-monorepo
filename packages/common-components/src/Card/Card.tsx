import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import { Paper } from "../Paper"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      backgroundColor: theme.palette.background.default,
      transition: `all ${theme.animation.transform}ms`,
      padding: 0,
    },
    hoverable: {
      "&:hover": {
        boxShadow: theme.shadows.shadow1,
      },
    },
  }),
)

export interface ICardProps {
  className?: string
  children?: ReactNode | ReactNode[]
  hoverable?: boolean
  border?: boolean
  shadow?: "shadow1" | "shadow2" | string | "none"
  fullWidth?: boolean
}

const Card: React.FC<ICardProps> = ({
  className,
  children,
  hoverable = false,
  border = true,
  shadow = "none",
  fullWidth,
}: ICardProps) => {
  const classes = useStyles()

  return (
    <Paper
      border={border}
      shape="square"
      shadow={shadow}
      fullWidth={fullWidth}
      className={clsx(className, classes.root, hoverable && classes.hoverable)}
    >
      {children}
    </Paper>
  )
}

export default Card
