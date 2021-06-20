import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { Paper } from "../Paper"

const useStyles = makeStyles(
  ({ palette, shadows, animation, overrides, breakpoints }: ITheme) =>
    createStyles({
      root: {
        backgroundColor: palette.background.default,
        transition: `all ${animation.transform}ms`,
        padding: 0,
        ...overrides?.Card?.root
      },
      hoverable: {
        [breakpoints.up("sm")]: {
          "&:hover": {
            boxShadow: shadows.shadow2
          }
        },
        ...overrides?.Card?.hoverable
      }
    })
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
  fullWidth
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
