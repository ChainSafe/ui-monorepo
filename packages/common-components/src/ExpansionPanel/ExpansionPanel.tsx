import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      position: "relative",
      "&.basic": {},
      "&.borderless": {},
    },
    icon: {
      "& svg": {
        width: theme.constants.generalUnit,
        height: theme.constants.generalUnit * 1.5,
        fill: theme.palette["grey"][9],
        transitionDuration: `${theme.animation.transform}ms`,
      },
    },
    heading: {
      "&.active": {
        "& svg": {
          transform: "rotateZ(90deg)",
        },
      },
    },
    content: {
      overflow: "hidden",
      height: 0,
      transitionDuration: `${theme.animation.transform}ms`,
      "&.active": {
        height: "auto",
      },
    },
  }),
)

export interface IExpansionPanelProps {
  heading: string
  children?: ReactNode | ReactNode[] | null
  active: boolean
  variant: "basic" | "borderless"
}

const ExpansionPanel: React.FC<IExpansionPanelProps> = ({
  children,
  heading,
  variant = "basic",
  active = false,
}: IExpansionPanelProps) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.root, variant)}>
      <section
        onClick={() => (active = !active)}
        className={clsx(classes.heading, {
          ["active"]: active,
        })}
      >
        <Typography>{heading}</Typography>
      </section>
      <section
        className={clsx(classes.content, {
          ["active"]: active,
        })}
      >
        {children}
      </section>
    </div>
  )
}

export default ExpansionPanel
