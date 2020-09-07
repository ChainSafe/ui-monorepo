import React, { ReactNode, useState } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"
import { DirectionalRightIcon } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      position: "relative",
      "&.basic": {
        border: `1px solid ${theme.palette["gray"][5]}`,
      },
      "&.borderless": {},
    },
    icon: {
      "& svg": {
        width: theme.constants.generalUnit,
        height: theme.constants.generalUnit * 1.5,
        fill: theme.palette["gray"][9],
        transitionDuration: `${theme.animation.transform}ms`,
      },
    },
    heading: {
      backgroundColor: theme.palette["gray"][2],
      padding: `${theme.constants.generalUnit * 1.5}px ${
        theme.constants.generalUnit * 2
      }px`,
      color: theme.palette["gray"][9],
      cursor: "pointer",
      "&.basic": {
        backgroundColor: theme.palette["gray"][2],
      },
      "&.borderless": {},
      "&.active": {
        "& svg": {
          transform: "rotateZ(90deg)",
        },
      },
    },
    content: {
      overflow: "hidden",
      color: theme.palette["gray"][8],
      height: 0,
      padding: `0 ${theme.constants.generalUnit * 2}px`,
      transitionDuration: `${theme.animation.transform}ms`,
      // opacity: 0,
      "&.basic": {
        backgroundColor: theme.palette.common.white.main,
        borderTop: `0px solid ${theme.palette["gray"][5]}`,
        "&.active": {
          borderTop: `1px solid ${theme.palette["gray"][5]}`,
        },
      },
      "&.active": {
        padding: `${theme.constants.generalUnit * 2}px ${
          theme.constants.generalUnit * 2
        }px`,
        opacity: 1,
        height: "auto",
      },
    },
  }),
)

export interface IExpansionPanelProps {
  header: string
  children?: ReactNode | ReactNode[] | null
  active?: boolean
  variant?: "basic" | "borderless"
  toggle?: (state: boolean) => void
}

const ExpansionPanel: React.FC<IExpansionPanelProps> = ({
  children,
  header,
  variant = "basic",
  toggle,
  active,
}: IExpansionPanelProps) => {
  const classes = useStyles()
  const [activeInternal, setActive] = useState(!!active)
  const handleToggle = () => {
    toggle && toggle(!activeInternal)
    setActive(!activeInternal)
  }
  return (
    <div className={clsx(classes.root, variant)}>
      <section
        onClick={() => handleToggle()}
        className={clsx(classes.heading, variant, {
          ["active"]: active != undefined ? active : activeInternal,
        })}
      >
        <DirectionalRightIcon className={classes.icon} />
        <Typography>{header}</Typography>
      </section>
      <section
        className={clsx(classes.content, variant, {
          ["active"]: active != undefined ? active : activeInternal,
        })}
      >
        {children}
      </section>
    </div>
  )
}

export default ExpansionPanel
